import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
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
  ): Promise<PCTQualificationDTO> {
    const result = await this.repository.getPCTQualification(
      locId,
      qualId,
      pctQualId,
    );
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
  ): Promise<PCTQualificationDTO> {
    const result = await this.repository.getPCTQualificationByDataYear(
      locId,
      qualId,
      qualDataYear,
    );
    if (result) {
      return this.map.one(result);
    } else {
      return null;
    }
  }

  async createPCTQualification(
    locationId: string,
    qualId: string,
    payload: PCTQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<PCTQualificationDTO> {
    const qual = await this.mpQualService.getQualification(locationId, qualId);

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

    const pctQual = this.repository.create({
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

    const result = await this.repository.save(pctQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async updatePCTQualification(
    locationId: string,
    qualId: string,
    pctQualId: string,
    payload: PCTQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<PCTQualificationDTO> {
    const pctQual = await this.getPCTQualification(
      locationId,
      qualId,
      pctQualId,
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

    await this.repository.save(pctQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.getPCTQualification(locationId, qualId, pctQualId);
  }

  async importPCTQualification(
    locationId: string,
    qualificationId: string,
    pctQualifications: PCTQualificationBaseDTO[],
    userId: string,
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
                );

                if (pctQualificationRecord) {
                  await this.updatePCTQualification(
                    locationId,
                    qualificationId,
                    pctQualificationRecord.id,
                    pctQualification,
                    userId,
                    true,
                  );
                } else {
                  await this.createPCTQualification(
                    locationId,
                    qualificationId,
                    pctQualification,
                    userId,
                    true,
                  );
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
