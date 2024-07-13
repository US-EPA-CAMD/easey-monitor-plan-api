import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  UnitCapacityBaseDTO,
  UnitCapacityDTO,
} from '../dtos/unit-capacity.dto';
import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';

@Injectable()
export class UnitCapacityWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: UnitCapacityWorkspaceRepository,
    private readonly map: UnitCapacityMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async importUnitCapacity(
    unitCapacities: UnitCapacityBaseDTO[],
    unitId: number,
    locationId: string,
    userId: string,
    trx?: EntityManager,
  ) {
    return Promise.all(
      unitCapacities.map(async unitCapacity => {
        const unitCapacityRecord = await withTransaction(
          this.repository,
          trx,
        ).getUnitCapacityByUnitIdAndDate(
          unitId,
          unitCapacity.beginDate,
          unitCapacity.endDate,
        );

        if (unitCapacityRecord) {
          await this.updateUnitCapacity({
            locationId,
            unitRecordId: unitId,
            unitCapacityId: unitCapacityRecord.id,
            payload: unitCapacity,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createUnitCapacity({
            locationId,
            unitId,
            payload: unitCapacity,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
  }

  async getUnitCapacities(
    locId: string,
    unitId: number,
  ): Promise<UnitCapacityDTO[]> {
    const results = await this.repository.getUnitCapacities(locId, unitId);

    return this.map.many(results);
  }

  async getUnitCapacity(
    locId: string,
    unitId: number,
    unitCapacityId: string,
    trx?: EntityManager,
  ): Promise<UnitCapacityDTO> {
    const result = await withTransaction(this.repository, trx).getUnitCapacity(
      unitCapacityId,
    );
    if (!result) {
      throw new EaseyException(
        new Error('Unit Capacity Not Found.'),
        HttpStatus.NOT_FOUND,
        {
          unitId,
          unitCapacityId,
        },
      );
    }
    return this.map.one(result);
  }

  async createUnitCapacity({
    locationId,
    unitId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    unitId: number;
    payload: UnitCapacityBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<UnitCapacityDTO> {
    const repository = withTransaction(this.repository, trx);

    const unitCapacity = repository.create({
      id: uuid(),
      unitId,
      maximumHourlyHeatInputCapacity: payload.maximumHourlyHeatInputCapacity,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(unitCapacity);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.getUnitCapacity(locationId, unitId, result.id, trx);
  }

  async updateUnitCapacity({
    locationId,
    unitRecordId,
    unitCapacityId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    unitRecordId: number;
    unitCapacityId: string;
    payload: UnitCapacityBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<UnitCapacityDTO> {
    const repository = withTransaction(this.repository, trx);

    const unitCapacity = await repository.getUnitCapacity(unitCapacityId);

    unitCapacity.maximumHourlyHeatInputCapacity =
      payload.maximumHourlyHeatInputCapacity;
    unitCapacity.beginDate = payload.beginDate;
    unitCapacity.endDate = payload.endDate;
    unitCapacity.userId = userId;
    unitCapacity.updateDate = currentDateTime();

    await repository.save(unitCapacity);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(unitCapacity);
  }
}
