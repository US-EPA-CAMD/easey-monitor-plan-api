import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorSystemDTO } from '../dtos/monitor-system-update.dto';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';

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
}
