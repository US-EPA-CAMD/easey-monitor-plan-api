import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import {
  MonitorQualificationBaseDTO,
  MonitorQualificationDTO,
} from '../dtos/monitor-qualification.dto';
import { MonitorQualification } from '../entities/monitor-qualification.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';

@Injectable()
export class MonitorQualificationWorkspaceService {
  constructor(
    @InjectRepository(MonitorQualificationWorkspaceRepository)
    private readonly repository: MonitorQualificationWorkspaceRepository,
    private readonly map: MonitorQualificationMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getQualifications(
    locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getQualification(
    locId: string,
    qualId: string,
  ): Promise<MonitorQualification> {
    const result = await this.repository.getQualification(locId, qualId);
    if (!result) {
      this.logger.error(NotFoundException, 'Qualification Not Found', true, {
        locId: locId,
        qualId: qualId,
      });
    }
    return result;
  }

  async createQualification(
    userId: string,
    locationId: string,
    payload: MonitorQualificationBaseDTO,
  ): Promise<MonitorQualificationDTO> {
    const qual = this.repository.create({
      id: uuid(),
      locationId,
      qualificationTypeCode: payload.qualificationTypeCode,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(qual);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(qual);
  }

  async updateQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: MonitorQualificationBaseDTO,
  ): Promise<MonitorQualificationDTO> {
    const qual = await this.getQualification(locId, qualId);

    qual.userId = userId;
    qual.qualificationTypeCode = payload.qualificationTypeCode;
    qual.beginDate = payload.beginDate;
    qual.endDate = payload.endDate;
    qual.userId = userId;
    qual.addDate = new Date(Date.now());
    qual.updateDate = new Date(Date.now());

    const result = await this.repository.save(qual);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }
}
