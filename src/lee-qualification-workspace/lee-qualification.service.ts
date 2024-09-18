import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  LEEQualificationBaseDTO,
  LEEQualificationDTO,
} from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { withTransaction } from '../utils';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';

@Injectable()
export class LEEQualificationWorkspaceService {
  constructor(
    private readonly repository: LEEQualificationWorkspaceRepository,
    private readonly map: LEEQualificationMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
    @Inject(forwardRef(() => MonitorQualificationWorkspaceService))
    private readonly mpQualService: MonitorQualificationWorkspaceService,
  ) {}

  async getLEEQualifications(
    locId: string,
    qualId: string,
  ): Promise<LEEQualificationDTO[]> {
    const results = await this.repository.getLEEQualifications(locId, qualId);
    return this.map.many(results);
  }

  async getLEEQualification(
    locId: string,
    qualId: string,
    leeQualId: string,
  ): Promise<LEEQualificationDTO> {
    const result = await this.repository.getLEEQualification(
      locId,
      qualId,
      leeQualId,
    );
    if (!result) {
      throw new EaseyException(
        new Error('LEE Qualification Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locId: locId,
          qualId: qualId,
          leeQualId: leeQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async createLEEQualification({
    locationId,
    qualId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    qualId: string;
    payload: LEEQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<LEEQualificationDTO> {
    const qual = await this.mpQualService.getQualification(
      locationId,
      qualId,
      trx,
    );

    if (qual.qualificationTypeCode !== 'LEE') {
      throw new EaseyException(
        new Error(
          'A Monitor Qualification LEE record should not be reported for qualification type codes other than LEE.',
        ),
        HttpStatus.BAD_REQUEST,
        {
          locationId: locationId,
          qualId: qualId,
        },
      );
    }

    const repository = withTransaction(this.repository, trx);

    const leeQual = repository.create({
      id: uuid(),
      qualificationId: qual.id,
      qualificationTestDate: payload.qualificationTestDate,
      parameterCode: payload.parameterCode,
      qualificationTestType: payload.qualificationTestType,
      potentialAnnualHgMassEmissions: payload.potentialAnnualHgMassEmissions,
      applicableEmissionStandard: payload.applicableEmissionStandard,
      unitsOfStandard: payload.unitsOfStandard,
      percentageOfEmissionStandard: payload.percentageOfEmissionStandard,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(leeQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }

  async updateLEEQualification({
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
    payload: LEEQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<LEEQualificationDTO> {
    const repository = withTransaction(this.repository, trx);

    const leeQual = await repository.getLEEQualification(
      locationId,
      qualId,
      pctQualId,
    );

    if (!leeQual) {
      throw new EaseyException(
        new Error('LEE Qualification Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locId: locationId,
          qualId: qualId,
          pctQualId: pctQualId,
        },
      );
    }

    leeQual.qualificationTestDate = payload.qualificationTestDate;
    leeQual.parameterCode = payload.parameterCode;
    leeQual.qualificationTestType = payload.qualificationTestType;
    leeQual.potentialAnnualHgMassEmissions =
      payload.potentialAnnualHgMassEmissions;
    leeQual.applicableEmissionStandard = payload.applicableEmissionStandard;
    leeQual.unitsOfStandard = payload.unitsOfStandard;
    leeQual.percentageOfEmissionStandard = payload.percentageOfEmissionStandard;
    leeQual.userId = userId;
    leeQual.updateDate = currentDateTime();

    await repository.save(leeQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(leeQual);
  }

  async importLEEQualification(
    locationId: string,
    qualificationId: string,
    leeQualifications: LEEQualificationBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    return Promise.all(
      leeQualifications.map(async leeQualification => {
        const leeQualificationRecord = await withTransaction(
          this.repository,
          trx,
        ).getLEEQualificationByTestDate(
          locationId,
          qualificationId,
          leeQualification.qualificationTestDate,
        );

        if (leeQualificationRecord) {
          await this.updateLEEQualification({
            locationId,
            qualId: qualificationId,
            pctQualId: leeQualificationRecord.id,
            payload: leeQualification,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createLEEQualification({
            locationId,
            qualId: qualificationId,
            payload: leeQualification,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
  }
}
