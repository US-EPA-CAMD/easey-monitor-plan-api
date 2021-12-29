import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorSystemDTO } from '../dtos/monitor-system-update.dto';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorSystem } from '../entities/monitor-system.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class MonitorSystemWorkspaceService {
  constructor(
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private repository: MonitorSystemWorkspaceRepository,
    private map: MonitorSystemMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getSystems(locationId: string): Promise<MonitorSystemDTO[]> {
    let result;
    try {
      result = await this.repository.find({
        where: {
          locationId,
        },
        order: {
          monitoringSystemId: 'ASC',
        },
      });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async createSystem(
    locationId: string,
    payload: UpdateMonitorSystemDTO,
    userId: string,
  ): Promise<MonitorSystemDTO> {
    let system;
    try {
      system = this.repository.create({
        id: uuid(),
        locationId,
        monitoringSystemId: payload.monitoringSystemId,
        systemDesignationCode: payload.systemDesignationCode,
        fuelCode: payload.fuelCode,
        systemTypeCode: payload.systemTypeCode,
        beginDate: payload.beginDate,
        beginHour: payload.beginHour,
        endDate: payload.endDate,
        endHour: payload.endHour,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      const result = await this.repository.save(system);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(system);
  }

  async getSystem(monitoringSystemId: string): Promise<MonitorSystem> {
    let result;
    try {
      result = await this.repository.findOne(monitoringSystemId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor System Not Found', true, {
        monitoringSystemId: monitoringSystemId,
      });
    }

    return result;
  }

  async updateSystem(
    monitoringSystemId: string,
    payload: UpdateMonitorSystemDTO,
    locId: string,
    userId: string,
  ): Promise<MonitorSystemDTO> {
    let result;
    try {
      const system = await this.getSystem(monitoringSystemId);

      system.systemTypeCode = payload.systemTypeCode;
      system.systemDesignationCode = payload.systemDesignationCode;
      system.fuelCode = payload.fuelCode;
      system.beginDate = payload.beginDate;
      system.beginHour = payload.beginHour;
      system.endDate = payload.endDate;
      system.endHour = payload.endHour;
      system.userId = userId;
      system.updateDate = new Date(Date.now());

      result = await this.repository.save(system);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }
}
