import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      this.logger.error(
        NotFoundException,
        'LEE Qualification Not Found',
        true,
        {
          locId: locId,
          qualId: qualId,
          pctQualId: pctQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async getLEEQualificationByTestDate(
    locId: string,
    qualId: string,
    qualTestDate: Date,
  ): Promise<LEEQualificationDTO> {
    const result = await this.repository.getLEEQualificationByTestDate(
      locId,
      qualId,
      qualTestDate,
    );
    if (result) {
      return this.map.one(result);
    }
    return result;
  }

  async createLEEQualification(
    userId: string,
    locationId: string,
    qualId: string,
    payload: LEEQualificationBaseDTO,
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
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async updateLEEQualification(
    userId: string,
    locationId: string,
    qualId: string,
    pctQualId: string,
    payload: LEEQualificationBaseDTO,
    isImport = false,
  ): Promise<LEEQualificationDTO> {
    const leeQual = await this.getLEEQualification(
      locationId,
      qualId,
      pctQualId,
    );

    leeQual.qualificationId = qualId;
    leeQual.qualificationTestDate = payload.qualificationTestDate;
    leeQual.parameterCode = payload.parameterCode;
    leeQual.qualificationTestType = payload.qualificationTestType;
    leeQual.potentialAnnualMassEmissions = payload.potentialAnnualMassEmissions;
    leeQual.applicableEmissionStandard = payload.applicableEmissionStandard;
    leeQual.unitsOfStandard = payload.unitsOfStandard;
    leeQual.percentageOfEmissionStandard = payload.percentageOfEmissionStandard;
    leeQual.userId = userId;
    leeQual.updateDate = new Date(Date.now());

    const result = await this.repository.save(leeQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
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
            const leeQualificationRecord = await this.getLEEQualificationByTestDate(
              locationId,
              qualificationId,
              leeQualification.qualificationTestDate,
            );

            if (leeQualificationRecord) {
              await this.updateLEEQualification(
                userId,
                locationId,
                qualificationId,
                leeQualificationRecord.id,
                leeQualification,
                true,
              );
            } else {
              await this.createLEEQualification(
                userId,
                locationId,
                qualificationId,
                leeQualification,
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
