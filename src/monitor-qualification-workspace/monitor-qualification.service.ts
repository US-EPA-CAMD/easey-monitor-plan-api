import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { v4 as uuid } from 'uuid';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { UpdateMonitorQualificationDTO } from '../dtos/monitor-qualification-update.dto';
import { MonitorQualification } from '../entities/monitor-qualification.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class MonitorQualificationWorkspaceService {
  constructor(
    @InjectRepository(MonitorQualificationWorkspaceRepository)
    private repository: MonitorQualificationWorkspaceRepository,
    private map: MonitorQualificationMap,
    private Logger: Logger,
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
  ): Promise<MonitorQualificationDTO> {
    const result = await this.repository.getQualification(locId, qualId);
    if (!result) {
      this.Logger.error(NotFoundException, 'Qualification Not Found', {
        locId: locId,
        qualId: qualId,
      });
    }
    return this.map.one(result);
  }

  async createQualification(
    userId: string,
    locationId: string,
    payload: UpdateMonitorQualificationDTO,
  ): Promise<MonitorQualificationDTO> {
    const qual = this.repository.create({
      id: uuid(),
      locationId,
      qualificationTypeCode: payload.qualificationTypeCode,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(qual);
    return this.map.one(qual);
  }

  async updateQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: UpdateMonitorQualificationDTO,
  ): Promise<MonitorQualificationDTO> {
    const qual = await this.getQualification(locId, qualId);

    qual.userId = userId;
    qual.qualificationTypeCode = payload.qualificationTypeCode;
    qual.beginDate = payload.beginDate;
    qual.endDate = payload.endDate;
    qual.userId = 'testuser';
    qual.addDate = new Date(Date.now());
    qual.updateDate = new Date(Date.now());

    const result = await this.repository.save(qual);
    return this.map.one(result);
  }
}
