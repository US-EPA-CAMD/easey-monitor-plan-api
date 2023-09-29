import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';
import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import {
  UnitCapacityBaseDTO,
  UnitCapacityDTO,
} from '../dtos/unit-capacity.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

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
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const unitCapacity of unitCapacities) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const unitCapacityRecord = await this.repository.getUnitCapacityByUnitIdAndDate(
                  unitId,
                  unitCapacity.beginDate,
                  unitCapacity.endDate,
                );

                if (unitCapacityRecord) {
                  await this.updateUnitCapacity(
                    locationId,
                    unitId,
                    unitCapacityRecord.id,
                    unitCapacity,
                    userId,
                    true,
                  );
                } else {
                  await this.createUnitCapacity(
                    locationId,
                    unitId,
                    unitCapacity,
                    userId,
                    true,
                  );
                }
                innerResolve(true);
              })()
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })()
    });
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
  ): Promise<UnitCapacityDTO> {
    const result = await this.repository.getUnitCapacity(unitCapacityId);
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

  async createUnitCapacity(
    locationId: string,
    unitId: number,
    payload: UnitCapacityBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<UnitCapacityDTO> {
    const unitCapacity = this.repository.create({
      id: uuid(),
      unitId,
      maximumHourlyHeatInputCapacity: payload.maximumHourlyHeatInputCapacity,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await this.repository.save(unitCapacity);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.getUnitCapacity(locationId, unitId, result.id);
  }

  async updateUnitCapacity(
    locationId: string,
    unitRecordId: number,
    unitCapacityId: string,
    payload: UnitCapacityBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<UnitCapacityDTO> {
    const unitCapacity = await this.repository.getUnitCapacity(unitCapacityId);

    unitCapacity.maximumHourlyHeatInputCapacity =
      payload.maximumHourlyHeatInputCapacity;
    unitCapacity.beginDate = payload.beginDate;
    unitCapacity.endDate = payload.endDate;
    unitCapacity.userId = userId;
    unitCapacity.updateDate = currentDateTime();

    await this.repository.save(unitCapacity);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(unitCapacity);
  }
}
