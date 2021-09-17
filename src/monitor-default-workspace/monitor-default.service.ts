import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';
import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { UpdateMonitorDefaultDTO } from '../dtos/monitor-default-update.dto';

@Injectable()
export class MonitorDefaultWorkspaceService {
  constructor(
    @InjectRepository(MonitorDefaultWorkspaceRepository)
    private repository: MonitorDefaultWorkspaceRepository,
    private map: MonitorDefaultMap,
  ) {}

  async getDefaults(locationId: string): Promise<MonitorDefaultDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getDefault(
    locationId: string,
    defaultId: string,
  ): Promise<MonitorDefaultDTO> {
    const result = await this.repository.getDefault(locationId, defaultId);

    if (!result) {
      throw new NotFoundException('Monitor Default not found');
    }

    return this.map.one(result);
  }

  async updateDefault(
    locationId: string,
    defaultId: string,
    payload: UpdateMonitorDefaultDTO,
  ): Promise<MonitorDefaultDTO> {
    const monDefault = await this.getDefault(locationId, defaultId);

    monDefault.parameterCode = payload.parameterCode;
    monDefault.defaultValue = payload.defaultValue;
    monDefault.defaultUnitsOfMeasureCode = payload.defaultUnitsOfMeasureCode;
    monDefault.defaultPurposeCode = payload.defaultPurposeCode;
    monDefault.fuelCode = payload.fuelCode;
    monDefault.operatingConditionCode = payload.operatingConditionCode;
    monDefault.defaultSourceCode = payload.defaultSourceCode;
    monDefault.groupId = payload.groupId;
    monDefault.beginDate = payload.beginDate;
    monDefault.beginHour = payload.beginHour;
    monDefault.endDate = payload.endDate;
    monDefault.endHour = payload.endHour;
    // TODO
    monDefault.userId = 'testuser';
    monDefault.updateDate = new Date(Date.now());

    await this.repository.save(monDefault);

    return this.getDefault(locationId, defaultId);
  }
}
