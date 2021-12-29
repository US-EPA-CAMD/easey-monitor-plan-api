import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { UpdateLEEQualificationDTO } from '../dtos/lee-qualification-update.dto';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class LEEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LEEQualificationWorkspaceRepository)
    private repository: LEEQualificationWorkspaceRepository,
    private map: LEEQualificationMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getLEEQualifications(
    locId: string,
    qualId: string,
  ): Promise<LEEQualificationDTO[]> {
    this.logger.info('Getting lee qualfications');

    let result;
    try {
      result = await this.repository.getLEEQualifications(locId, qualId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got lee qualfications');

    return this.map.many(result);
  }

  async getLEEQualification(
    locId: string,
    qualId: string,
    pctQualId: string,
  ): Promise<LEEQualificationDTO> {
    this.logger.info('Getting lee qualifications');

    let result;
    try {
      result = await this.repository.getLEEQualification(
        locId,
        qualId,
        pctQualId,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got lee qualifications');

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
    payload: UpdateLEEQualificationDTO,
  ): Promise<LEEQualificationDTO> {
    let result;
    try {
      const load = this.repository.create({
        id: uuid(),
        qualificationId: qualId,
        qualificationTestDate: payload.qualificationTestDate,
        parameterCode: payload.parameterCode,
        qualificationTestType: payload.qualificationTestType,
        potentialAnnualHgMassEmissions: payload.potentialAnnualHgMassEmissions,
        applicableEmissionStandard: payload.applicableEmissionStandard,
        unitsOfStandard: payload.unitsOfStandard,
        percentageOfEmissionStandard: payload.percentageOfEmissionStandard,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      result = await this.repository.save(load);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }

  async updateLEEQualification(
    userId: string,
    locId: string,
    qualId: string,
    pctQualId: string,
    payload: UpdateLEEQualificationDTO,
  ): Promise<LEEQualificationDTO> {
    let result;
    try {
      const leeQual = await this.getLEEQualification(locId, qualId, pctQualId);

      leeQual.qualificationId = qualId;
      leeQual.qualificationTestDate = payload.qualificationTestDate;
      leeQual.parameterCode = payload.parameterCode;
      leeQual.qualificationTestType = payload.qualificationTestType;
      leeQual.potentialAnnualHgMassEmissions =
        payload.potentialAnnualHgMassEmissions;
      leeQual.applicableEmissionStandard = payload.applicableEmissionStandard;
      leeQual.unitsOfStandard = payload.unitsOfStandard;
      leeQual.percentageOfEmissionStandard =
        payload.percentageOfEmissionStandard;
      leeQual.userId = userId;
      leeQual.updateDate = new Date(Date.now());

      result = await this.repository.save(leeQual);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }
}
