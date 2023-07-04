import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  LEEQualificationBaseDTO,
  LEEQualificationDTO,
} from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class LEEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LEEQualificationWorkspaceRepository)
    private readonly repository: LEEQualificationWorkspaceRepository,
    private readonly map: LEEQualificationMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
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
    pctQualId: string,
  ): Promise<LEEQualificationDTO> {
    const result = await this.repository.getLEEQualification(
      locId,
      qualId,
      pctQualId,
    );
    if (!result) {
      throw new EaseyException(
        new Error('LEE Qualification Not Found'),
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

  async createLEEQualification(
    locationId: string,
    qualId: string,
    payload: LEEQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<LEEQualificationDTO> {
    const load = this.repository.create({
      id: uuid(),
      qualificationId: qualId,
      qualificationTestDate: payload.qualificationTestDate,
      parameterCode: payload.parameterCode,
      qualificationTestType: payload.qualificationTestType,
      potentialAnnualMassEmissions: payload.potentialAnnualMassEmissions,
      applicableEmissionStandard: payload.applicableEmissionStandard,
      unitsOfStandard: payload.unitsOfStandard,
      percentageOfEmissionStandard: payload.percentageOfEmissionStandard,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await this.repository.save(load);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async updateLEEQualification(
    locationId: string,
    qualId: string,
    pctQualId: string,
    payload: LEEQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<LEEQualificationDTO> {
    const leeQual = await this.repository.getLEEQualification(
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

    leeQual.qualificationId = qualId;
    leeQual.qualificationTestDate = payload.qualificationTestDate;
    leeQual.parameterCode = payload.parameterCode;
    leeQual.qualificationTestType = payload.qualificationTestType;
    leeQual.potentialAnnualMassEmissions = payload.potentialAnnualMassEmissions;
    leeQual.applicableEmissionStandard = payload.applicableEmissionStandard;
    leeQual.unitsOfStandard = payload.unitsOfStandard;
    leeQual.percentageOfEmissionStandard = payload.percentageOfEmissionStandard;
    leeQual.userId = userId;
    leeQual.updateDate = currentDateTime();

    await this.repository.save(leeQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(leeQual);
  }

  async importLEEQualification(
    locationId: string,
    qualificationId: string,
    leeQualifications: LEEQualificationBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const leeQualification of leeQualifications) {
        promises.push(
          new Promise(async innerResolve => {
            const leeQualificationRecord = await this.repository.getLEEQualificationByTestDate(
              locationId,
              qualificationId,
              leeQualification.qualificationTestDate,
            );

            if (leeQualificationRecord) {
              await this.updateLEEQualification(
                locationId,
                qualificationId,
                leeQualificationRecord.id,
                leeQualification,
                userId,
                true,
              );
            } else {
              await this.createLEEQualification(
                locationId,
                qualificationId,
                leeQualification,
                userId,
                true,
              );
            }

            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }
}
