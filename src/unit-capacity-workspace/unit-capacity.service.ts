import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import { UpdateUnitCapacityDTO } from '../dtos/unit-capacity-update.dto';

@Injectable()
export class UnitCapacityWorkspaceService {
  constructor(
    private Logger: Logger,
    private readonly repository: UnitCapacityWorkspaceRepository,
    private readonly map: UnitCapacityMap,
  ) {}

  async getUnitCapacities(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitCapacityDTO[]> {
    const results = await this.repository.getUnitCapacities(
      locId,
      unitRecordId,
    );

    return this.map.many(results);
  }

  async getUnitCapacity(
    locId: string,
    unitRecordId: number,
    unitCapacityId: string,
  ): Promise<UnitCapacityDTO> {
    const result = await this.repository.getUnitCapacity(
      locId,
      unitRecordId,
      unitCapacityId,
    );
    if (!result) {
      this.Logger.error(NotFoundException, 'Monitor Load Not Found', {
        unitRecordId: unitRecordId,
        unitCapacityId: unitCapacityId,
      });
    }
    return this.map.one(result);
  }

  async createUnitCapacity(
    userId: string,
    locId: string,
    unitRecordId: number,
    payload: UpdateUnitCapacityDTO,
  ): Promise<UnitCapacityDTO> {
    const load = this.repository.create({
      id: uuid(),
      unitId: unitRecordId,
      maximumHourlyHeatInputCapacity: payload.maximumHourlyHeatInputCapacity,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId.slice(0, 8),
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);
    return this.map.one(result);
  }

  async updateUnitCapacity(
    userId: string,
    locId: string,
    unitRecordId: number,
    unitCapacityId: string,
    payload: UpdateUnitCapacityDTO,
  ): Promise<UnitCapacityDTO> {
    const unitCapacity = await this.getUnitCapacity(
      locId,
      unitRecordId,
      unitCapacityId,
    );

    unitCapacity.maximumHourlyHeatInputCapacity =
      payload.maximumHourlyHeatInputCapacity;
    unitCapacity.beginDate = payload.beginDate;
    unitCapacity.endDate = payload.endDate;
    // unitCapacity.userId = userId;
    // temporary:
    unitCapacity.userId = userId.slice(0, 8);
    unitCapacity.updateDate = new Date(Date.now());

    await this.repository.save(unitCapacity);
    return this.getUnitCapacity(locId, unitRecordId, unitCapacityId);
  }
}
