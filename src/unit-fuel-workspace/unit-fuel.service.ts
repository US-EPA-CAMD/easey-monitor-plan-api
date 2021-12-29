import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { UpdateUnitFuelDTO } from '../dtos/unit-fuel-update.dto';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class UnitFuelWorkspaceService {
  constructor(
    @InjectRepository(UnitFuelWorkspaceRepository)
    readonly repository: UnitFuelWorkspaceRepository,
    readonly map: UnitFuelMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getUnitFuels(locId: string, unitId: number): Promise<UnitFuelDTO[]> {
    let result;
    try {
      result = await this.repository.getUnitFuels(locId, unitId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getUnitFuel(
    locId: string,
    unitId: number,
    unitFuelId: string,
  ): Promise<UnitFuelDTO> {
    let result;
    try {
      result = await this.repository.getUnitFuel(locId, unitId, unitFuelId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Unit Fuel Not Found', true, {
        locId: locId,
        unitId: unitId,
        unitFuelId: unitFuelId,
      });
    }
    return this.map.one(result);
  }

  async createUnitFuel(
    userId: string,
    locId: string,
    unitId: number,
    payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    let result;
    try {
      const unitFuel = this.repository.create({
        id: uuid(),
        unitId: unitId,
        fuelCode: payload.fuelCode,
        indicatorCode: payload.indicatorCode,
        ozoneSeasonIndicator: payload.ozoneSeasonIndicator,
        demGCV: payload.demGCV,
        demSO2: payload.demSO2,
        beginDate: payload.beginDate,
        endDate: payload.endDate,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      result = await this.repository.save(unitFuel);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }

  async updateUnitFuel(
    userId: string,
    locId: string,
    unitId: number,
    unitFuelId: string,
    payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    try {
      const unitFuel = await this.getUnitFuel(locId, unitId, unitFuelId);

      unitFuel.fuelCode = payload.fuelCode;
      unitFuel.indicatorCode = payload.indicatorCode;
      unitFuel.ozoneSeasonIndicator = payload.ozoneSeasonIndicator;
      unitFuel.demGCV = payload.demGCV;
      unitFuel.demSO2 = payload.demSO2;
      unitFuel.beginDate = payload.beginDate;
      unitFuel.endDate = payload.endDate;
      unitFuel.userId = userId;
      unitFuel.updateDate = new Date(Date.now());

      await this.repository.save(unitFuel);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getUnitFuel(locId, unitId, unitFuelId);
  }
}
