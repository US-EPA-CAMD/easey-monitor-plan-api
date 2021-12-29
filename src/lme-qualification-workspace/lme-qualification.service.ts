import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { UpdateLMEQualificationDTO } from '../dtos/lme-qualification-update.dto';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class LMEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LMEQualificationWorkspaceRepository)
    private repository: LMEQualificationWorkspaceRepository,
    private map: LMEQualificationMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getLMEQualifications(
    locId: string,
    qualId: string,
  ): Promise<LMEQualificationDTO[]> {
    let result;
    try {
      result = await this.repository.getLMEQualifications(locId, qualId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getLMEQualification(
    locId: string,
    qualId: string,
    lmeQualId: string,
  ): Promise<LMEQualificationDTO> {
    let result;
    try {
      result = await this.repository.getLMEQualification(
        locId,
        qualId,
        lmeQualId,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(
        NotFoundException,
        'LME Qualification Not Found',
        true,
        {
          locId: locId,
          qualId: qualId,
          lmeQualId: lmeQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async createLMEQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: UpdateLMEQualificationDTO,
  ): Promise<LMEQualificationDTO> {
    let result;
    try {
      const lmeQual = this.repository.create({
        id: uuid(),
        qualificationId: qualId,
        qualificationDataYear: payload.qualificationDataYear,
        operatingHours: payload.operatingHours,
        so2Tons: payload.so2Tons,
        noxTons: payload.noxTons,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      result = await this.repository.save(lmeQual);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }

  async updateLMEQualification(
    userId: string,
    locId: string,
    qualId: string,
    lmeQualId: string,
    payload: UpdateLMEQualificationDTO,
  ): Promise<LMEQualificationDTO> {
    let result;
    try {
      const lmeQual = await this.getLMEQualification(locId, qualId, lmeQualId);

      lmeQual.qualificationId = qualId;
      lmeQual.qualificationDataYear = payload.qualificationDataYear;
      lmeQual.operatingHours = payload.operatingHours;
      lmeQual.so2Tons = payload.so2Tons;
      lmeQual.noxTons = payload.noxTons;
      lmeQual.userId = userId;
      lmeQual.updateDate = new Date(Date.now());

      result = await this.repository.save(lmeQual);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }
}
