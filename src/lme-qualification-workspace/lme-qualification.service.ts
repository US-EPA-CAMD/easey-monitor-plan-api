import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  LMEQualificationBaseDTO,
  LMEQualificationDTO,
} from '../dtos/lme-qualification.dto';
import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { withTransaction } from '../utils';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';

@Injectable()
export class LMEQualificationWorkspaceService {
  constructor(
    private readonly repository: LMEQualificationWorkspaceRepository,
    private readonly map: LMEQualificationMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
    @Inject(forwardRef(() => MonitorQualificationWorkspaceService))
    private readonly mpQualService: MonitorQualificationWorkspaceService,
  ) {}

  async getLMEQualifications(
    locId: string,
    qualId: string,
  ): Promise<LMEQualificationDTO[]> {
    const results = await this.repository.getLMEQualifications(locId, qualId);
    return this.map.many(results);
  }

  async getLMEQualification(
    locId: string,
    qualId: string,
    lmeQualId: string,
  ): Promise<LMEQualificationDTO> {
    const result = await this.repository.getLMEQualification(
      locId,
      qualId,
      lmeQualId,
    );
    if (!result) {
      throw new EaseyException(
        new Error('LME Qualification Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locId: locId,
          qualId: qualId,
          lmeQualId: lmeQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async getLMEQualificationByDataYear(
    locId: string,
    qualId: string,
    qualDataYear: number,
    trx?: EntityManager,
  ): Promise<LMEQualificationDTO> {
    const result = await withTransaction(
      this.repository,
      trx,
    ).getLMEQualificationByDataYear(locId, qualId, qualDataYear);
    if (result) {
      return this.map.one(result);
    }
  }

  async createLMEQualification({
    locationId,
    qualId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    qualId: string;
    payload: LMEQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<LMEQualificationDTO> {
    const qual = await this.mpQualService.getQualification(
      locationId,
      qualId,
      trx,
    );

    if (!['LMEA', 'LMES'].includes(qual.qualificationTypeCode)) {
      throw new EaseyException(
        new Error(
          'A Monitor Qualification LME record should not be reported for qualification type codes other than LMEA and LMES.',
        ),
        HttpStatus.BAD_REQUEST,
        {
          locationId: locationId,
          qualId: qualId,
        },
      );
    }

    const repository = withTransaction(this.repository, trx);

    const lmeQual = repository.create({
      id: uuid(),
      qualificationId: qual.id,
      qualificationDataYear: payload.qualificationDataYear,
      operatingHours: payload.operatingHours,
      so2Tons: payload.so2Tons,
      noxTons: payload.noxTons,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(lmeQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }

  async updateLMEQualification({
    locationId,
    qualId,
    lmeQualId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    qualId: string;
    lmeQualId: string;
    payload: LMEQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<LMEQualificationDTO> {
    const repository = withTransaction(this.repository, trx);

    const lmeQual = await repository.getLMEQualification(
      locationId,
      qualId,
      lmeQualId,
    );

    lmeQual.qualificationId = qualId;
    lmeQual.qualificationDataYear = payload.qualificationDataYear;
    lmeQual.operatingHours = payload.operatingHours;
    lmeQual.so2Tons = payload.so2Tons;
    lmeQual.noxTons = payload.noxTons;
    lmeQual.userId = userId;
    lmeQual.updateDate = currentDateTime();

    const result = await repository.save(lmeQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }

  async importLMEQualification(
    locationId: string,
    qualificationId: string,
    lmeQualifications: LMEQualificationBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    return Promise.all(
      lmeQualifications.map(async lmeQualification => {
        const lmeQualRecord = await this.getLMEQualificationByDataYear(
          locationId,
          qualificationId,
          lmeQualification.qualificationDataYear,
          trx,
        );

        if (lmeQualRecord) {
          await this.updateLMEQualification({
            locationId,
            qualId: qualificationId,
            lmeQualId: lmeQualRecord.id,
            payload: lmeQualification,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createLMEQualification({
            locationId,
            qualId: qualificationId,
            payload: lmeQualification,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
  }
}
