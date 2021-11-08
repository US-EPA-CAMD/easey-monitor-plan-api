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
    private readonly logger: Logger,
    private readonly repository: UnitCapacityWorkspaceRepository,
    private readonly map: UnitCapacityMap,
  ) {}

  async getUnitCapacities(
    locId: string,
    unitId: number,
  ): Promise<UnitCapacityDTO[]> {
    const results = await this.repository.getUnitCapacities(locId, unitId);

    console.log(results);

    return this.map.many(results);
  }

  async getUnitCapacity(
    locId: string,
    unitId: number,
    unitCapacityId: string,
  ): Promise<UnitCapacityDTO> {
    const result = await this.repository.getUnitCapacity(
      locId,
      unitId,
      unitCapacityId,
    );
    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Load Not Found', {
        unitId,
        unitCapacityId,
      });
    }
    return this.map.one(result);
  }

  async createUnitCapacity(
    userId: string,
    locId: string,
    unitId: number,
    payload: UpdateUnitCapacityDTO,
  ): Promise<UnitCapacityDTO> {
    const unitCapacity = this.repository.create({
      id: uuid(),
      unitId,
      maximumHourlyHeatInputCapacity: payload.maximumHourlyHeatInputCapacity,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId.slice(0, 8),
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(unitCapacity);

    return this.getUnitCapacity(locId, unitId, result.id);
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
    unitCapacity.userId = userId.slice(0, 8);
    unitCapacity.updateDate = new Date(Date.now());

    await this.repository.save(unitCapacity);
    return this.getUnitCapacity(locId, unitRecordId, unitCapacityId);
  }
}
