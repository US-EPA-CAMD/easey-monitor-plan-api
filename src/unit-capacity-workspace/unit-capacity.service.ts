import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import { UpdateUnitCapacityDTO } from '../dtos/unit-capacity-update.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class UnitCapacityWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: UnitCapacityWorkspaceRepository,
    private readonly map: UnitCapacityMap,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getUnitCapacities(
    locId: string,
    unitId: number,
  ): Promise<UnitCapacityDTO[]> {
    let result;
    try {
      result = await this.repository.getUnitCapacities(locId, unitId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getUnitCapacity(
    locId: string,
    unitId: number,
    unitCapacityId: string,
  ): Promise<UnitCapacityDTO> {
    let result;
    try {
      result = await this.repository.getUnitCapacity(
        locId,
        unitId,
        unitCapacityId,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Load Not Found', true, {
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
    let result;
    try {
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

      result = await this.repository.save(unitCapacity);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getUnitCapacity(locId, unitId, result.id);
  }

  async updateUnitCapacity(
    userId: string,
    locId: string,
    unitRecordId: number,
    unitCapacityId: string,
    payload: UpdateUnitCapacityDTO,
  ): Promise<UnitCapacityDTO> {
    try {
      const unitCapacity = await this.getUnitCapacity(
        locId,
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
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getUnitCapacity(locId, unitRecordId, unitCapacityId);
  }
}
