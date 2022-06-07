import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';
import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import {
  UnitCapacityBaseDTO,
  UnitCapacityDTO,
} from '../dtos/unit-capacity.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class UnitCapacityWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: UnitCapacityWorkspaceRepository,
    private readonly map: UnitCapacityMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async importUnityCapacity(
    unitCapacities: UnitCapacityBaseDTO[],
    unitId: number,
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const unitCapacity of unitCapacities) {
        promises.push(
          new Promise(async innerResolve => {
            const unitCapacityRecord = await this.repository.getUnitCapacityByUnitIdAndDate(
              unitId,
              unitCapacity.beginDate,
              unitCapacity.endDate,
            );

            if (unitCapacityRecord !== undefined) {
              await this.updateUnitCapacity(
                userId,
                locationId,
                unitId,
                unitCapacityRecord.id,
                unitCapacity,
                true,
              );
            } else {
              await this.createUnitCapacity(
                userId,
                locationId,
                unitId,
                unitCapacity,
                true,
              );
            }
            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
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
    const result = await this.repository.getUnitCapacity(
      locId,
      unitId,
      unitCapacityId,
    );
    if (!result) {
      this.logger.error(NotFoundException, 'Unit Capacity Not Found', true, {
        unitId,
        unitCapacityId,
      });
    }
    return this.map.one(result);
  }

  async createUnitCapacity(
    userId: string,
    locationId: string,
    unitId: number,
    payload: UnitCapacityBaseDTO,
    isImport = false,
  ): Promise<UnitCapacityDTO> {
    const unitCapacity = this.repository.create({
      id: uuid(),
      unitId,
      maximumHourlyHeatInputCapacity: payload.maximumHourlyHeatInputCapacity,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(unitCapacity);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.getUnitCapacity(locationId, unitId, result.id);
  }

  async updateUnitCapacity(
    userId: string,
    locationId: string,
    unitRecordId: number,
    unitCapacityId: string,
    payload: UnitCapacityBaseDTO,
    isImport = false,
  ): Promise<UnitCapacityDTO> {
    const unitCapacity = await this.getUnitCapacity(
      locationId,
      unitRecordId,
      unitCapacityId,
    );

    unitCapacity.maximumHourlyHeatInputCapacity =
      payload.maximumHourlyHeatInputCapacity;
    unitCapacity.beginDate = payload.beginDate;
    unitCapacity.endDate = payload.endDate;
    unitCapacity.userId = userId;
    unitCapacity.updateDate = new Date(Date.now());

    await this.repository.save(unitCapacity);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.getUnitCapacity(locationId, unitRecordId, unitCapacityId);
  }
}
