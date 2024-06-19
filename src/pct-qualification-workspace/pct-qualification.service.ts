import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  PCTQualificationBaseDTO,
  PCTQualificationDTO,
} from '../dtos/pct-qualification.dto';
import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';

@Injectable()
export class PCTQualificationWorkspaceService {
  constructor(
    private readonly repository: PCTQualificationWorkspaceRepository,
    private readonly map: PCTQualificationMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
    @Inject(forwardRef(() => MonitorQualificationWorkspaceService))
    private readonly mpQualService: MonitorQualificationWorkspaceService,
  ) {}

  async getPCTQualifications(
    locId: string,
    qualId: string,
  ): Promise<PCTQualificationDTO[]> {
    const results = await this.repository.getPCTQualifications(locId, qualId);
    return this.map.many(results);
  }

  async getPCTQualification(
    locId: string,
    qualId: string,
    pctQualId: string,
    trx?: EntityManager,
  ): Promise<PCTQualificationDTO> {
    const result = await (
      trx?.withRepository(this.repository) ?? this.repository
    ).getPCTQualification(locId, qualId, pctQualId);
    if (!result) {
      throw new EaseyException(
        new Error('PCT Qualification Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locId: locId,
          qualId: qualId,
          pctQualId: pctQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async getPCTQualificationByDataYear(
    locId: string,
    qualId: string,
    qualDataYear: number,
    trx?: EntityManager,
  ): Promise<PCTQualificationDTO> {
    const result = await (
      trx?.withRepository(this.repository) ?? this.repository
    ).getPCTQualificationByDataYear(locId, qualId, qualDataYear);
    if (result) {
      return this.map.one(result);
    } else {
      return null;
    }
  }

  async createPCTQualification({
    locationId,
    qualId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    qualId: string;
    payload: PCTQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<PCTQualificationDTO> {
    const qual = await this.mpQualService.getQualification(
      locationId,
      qualId,
      trx,
    );

    if (!['PK', 'SK', 'GF'].includes(qual.qualificationTypeCode)) {
      throw new EaseyException(
        new Error(
          'A Monitor Qualification PCT record should not be reported for qualification type codes other than PK,SK and GF.',
        ),
        HttpStatus.BAD_REQUEST,
        {
          locationId: locationId,
          qualId: qualId,
        },
      );
    }

    const repository = trx?.withRepository(this.repository) ?? this.repository;

    const pctQual = repository.create({
      id: uuid(),
      qualificationId: qual.id,
      qualificationYear: payload.qualificationYear,
      averagePercentValue: payload.averagePercentValue,
      yr1QualificationDataYear: payload.yr1QualificationDataYear,
      yr1QualificationDataTypeCode: payload.yr1QualificationDataTypeCode,
      yr1PercentageValue: payload.yr1PercentageValue,
      yr2QualificationDataYear: payload.yr2QualificationDataYear,
      yr2QualificationDataTypeCode: payload.yr2QualificationDataTypeCode,
      yr2PercentageValue: payload.yr2PercentageValue,
      yr3QualificationDataYear: payload.yr3QualificationDataYear,
      yr3QualificationDataTypeCode: payload.yr3QualificationDataTypeCode,
      yr3PercentageValue: payload.yr3PercentageValue,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(pctQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }

  async updatePCTQualification({
    locationId,
    qualId,
    pctQualId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    qualId: string;
    pctQualId: string;
    payload: PCTQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<PCTQualificationDTO> {
    const pctQual = await this.getPCTQualification(
      locationId,
      qualId,
      pctQualId,
      trx,
    );

    pctQual.qualificationId = qualId;
    pctQual.qualificationYear = payload.qualificationYear;
    pctQual.averagePercentValue = payload.averagePercentValue;
    pctQual.yr1QualificationDataYear = payload.yr1QualificationDataYear;
    pctQual.yr1QualificationDataTypeCode = payload.yr1QualificationDataTypeCode;
    pctQual.yr1PercentageValue = payload.yr1PercentageValue;
    pctQual.yr2QualificationDataYear = payload.yr2QualificationDataYear;
    pctQual.yr2QualificationDataTypeCode = payload.yr2QualificationDataTypeCode;
    pctQual.yr2PercentageValue = payload.yr2PercentageValue;
    pctQual.yr3QualificationDataYear = payload.yr3QualificationDataYear;
    pctQual.yr3QualificationDataTypeCode = payload.yr3QualificationDataTypeCode;
    pctQual.yr3PercentageValue = payload.yr3PercentageValue;
    pctQual.userId = userId;
    pctQual.updateDate = currentDateTime().toISOString();

    await (trx?.withRepository(this.repository) ?? this.repository).save(
      pctQual,
    );

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.getPCTQualification(locationId, qualId, pctQualId, trx);
  }

  async importPCTQualification(
    locationId: string,
    qualificationId: string,
    pctQualifications: PCTQualificationBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];
        for (const pctQualification of pctQualifications) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const pctQualificationRecord = await this.getPCTQualificationByDataYear(
                  locationId,
                  qualificationId,
                  pctQualification.qualificationYear,
                  trx,
                );

                if (pctQualificationRecord) {
                  await this.updatePCTQualification({
                    locationId,
                    qualId: qualificationId,
                    pctQualId: pctQualificationRecord.id,
                    payload: pctQualification,
                    userId,
                    isImport: true,
                    trx,
                  });
                } else {
                  await this.createPCTQualification({
                    locationId,
                    qualId: qualificationId,
                    payload: pctQualification,
                    userId,
                    isImport: true,
                    trx,
                  });
                }

                innerResolve(true);
              })();
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })();
    });
  }
}
