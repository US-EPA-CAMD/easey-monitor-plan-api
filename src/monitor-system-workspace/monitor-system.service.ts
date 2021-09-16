import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorSystemDTO } from '../dtos/monitor-system-update.dto';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorSystem } from '../entities/monitor-system.entity';

@Injectable()
export class MonitorSystemWorkspaceService {
  constructor(
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private repository: MonitorSystemWorkspaceRepository,
    private map: MonitorSystemMap,
  ) {}

  async getSystems(locationId: string): Promise<MonitorSystemDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        monitoringSystemId: 'ASC',
      },
    });
    return this.map.many(results);
  }

  async createSystem(
    locationId: string,
    payload: UpdateMonitorSystemDTO,
  ): Promise<MonitorSystemDTO> {
    const system = this.repository.create({
      id: uuid(),
      locationId,
      monitoringSystemId: payload.monitoringSystemId,
      systemDesignationCode: payload.systemDesignationCode,
      systemTypeCode: payload.systemTypeCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(system);
    return this.map.one(system);
  }

  async getSystem(monitoringSystemId: string): Promise<MonitorSystem> {
    const result = await this.repository.findOne(monitoringSystemId);

    if (!result) {
      throw new NotFoundException('Monitor system not found');
    }

    return result;
  }

  async updateSystem(
    monitoringSystemId: string,
    payload: UpdateMonitorSystemDTO,
  ): Promise<MonitorSystemDTO> {
    const system = await this.getSystem(monitoringSystemId);

    system.systemDesignationCode = payload.systemTypeCode;
    system.systemDesignationCode = payload.systemDesignationCode;
    system.fuelCode = payload.fuelCode;
    system.beginDate = payload.beginDate;
    system.beginHour = payload.beginHour;
    system.endDate = payload.endDate;
    system.endHour = payload.endHour;
    // TODO: update to actual user logged in
    system.userId = 'testuser';
    system.updateDate = new Date(Date.now());

    const result = await this.repository.save(system);
    return this.map.one(result);
  }
}