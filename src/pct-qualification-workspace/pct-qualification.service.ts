import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { UpdatePCTQualificationDTO } from '../dtos/pct-qualification-update.dto';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class PCTQualificationWorkspaceService {
  constructor(
    @InjectRepository(PCTQualificationWorkspaceRepository)
    private repository: PCTQualificationWorkspaceRepository,
    private map: PCTQualificationMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getPCTQualifications(
    locId: string,
    qualId: string,
  ): Promise<PCTQualificationDTO[]> {
    let result;
    try {
      result = await this.repository.getPCTQualifications(locId, qualId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getPCTQualification(
    locId: string,
    qualId: string,
    pctQualId: string,
  ): Promise<PCTQualificationDTO> {
    let result;
    try {
      result = await this.repository.getPCTQualification(
        locId,
        qualId,
        pctQualId,
      );
      if (!result) {
        this.logger.error(
          NotFoundException,
          'PCT Qualification Not Found',
          true,
          {
            locId: locId,
            qualId: qualId,
            pctQualId: pctQualId,
          },
        );
      }
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }

  async createPCTQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: UpdatePCTQualificationDTO,
  ): Promise<PCTQualificationDTO> {
    let result;
    try {
      const load = this.repository.create({
        id: uuid(),
        qualificationId: qualId,
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

  async updatePCTQualification(
    userId: string,
    locId: string,
    qualId: string,
    pctQualId: string,
    payload: UpdatePCTQualificationDTO,
  ): Promise<PCTQualificationDTO> {
    try {
      const pctQual = await this.getPCTQualification(locId, qualId, pctQualId);

      pctQual.qualificationId = qualId;
      pctQual.qualificationYear = payload.qualificationYear;
      pctQual.averagePercentValue = payload.averagePercentValue;
      pctQual.yr1QualificationDataYear = payload.yr1QualificationDataYear;
      pctQual.yr1QualificationDataTypeCode =
        payload.yr1QualificationDataTypeCode;
      pctQual.yr1PercentageValue = payload.yr1PercentageValue;
      pctQual.yr2QualificationDataYear = payload.yr2QualificationDataYear;
      pctQual.yr2QualificationDataTypeCode =
        payload.yr2QualificationDataTypeCode;
      pctQual.yr2PercentageValue = payload.yr2PercentageValue;
      pctQual.yr3QualificationDataYear = payload.yr3QualificationDataYear;
      pctQual.yr3QualificationDataTypeCode =
        payload.yr3QualificationDataTypeCode;
      pctQual.yr3PercentageValue = payload.yr3PercentageValue;
      pctQual.userId = userId;
      pctQual.updateDate = new Date(Date.now());

      await this.repository.save(pctQual);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getPCTQualification(locId, qualId, pctQualId);
  }
}
