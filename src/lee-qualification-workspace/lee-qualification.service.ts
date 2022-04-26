import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { LEEQualificationBaseDTO } from '../dtos/lee-qualification.dto';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class LEEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LEEQualificationWorkspaceRepository)
    private readonly repository: LEEQualificationWorkspaceRepository,
    private readonly map: LEEQualificationMap,
    private readonly logger: Logger,
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

  async createLEEQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: LEEQualificationBaseDTO,
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
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }

  async updateLEEQualification(
    userId: string,
    locId: string,
    qualId: string,
    pctQualId: string,
    payload: LEEQualificationBaseDTO,
  ): Promise<LEEQualificationDTO> {
    const leeQual = await this.getLEEQualification(locId, qualId, pctQualId);

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
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }
}
