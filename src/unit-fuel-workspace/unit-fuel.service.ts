import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { UpdateUnitFuelDTO } from '../dtos/unit-fuel-update.dto';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelWorkspaceService {
  constructor(
    @InjectRepository(UnitFuelWorkspaceRepository)
    readonly repository: UnitFuelWorkspaceRepository,
    readonly map: UnitFuelMap,
    private Logger: Logger,
  ) {}

  async getUnitFuels(
    locId: string,
    unitId: number,
  ): Promise<UnitFuelDTO[]> {
    const results = await this.repository.getUnitFuels(locId, unitId);
    return this.map.many(results);
  }

  async getUnitFuel(
    locId: string,
    unitId: number,
    unitFuelId: string,
  ): Promise<UnitFuelDTO> {
    const result = await this.repository.getUnitFuel(
      locId,
      unitId,
      unitFuelId,
    );
    if (!result) {
      this.Logger.error(NotFoundException, 'Unit Fuel Not Found', {
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
    // temporary:
    const testUserId = 'testuser';
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
      userId: testUserId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(unitFuel);
    return this.map.one(result);
  }

  async updateUnitFuel(
    userId: string,
    locId: string,
    unitId: number,
    unitFuelId: string,
    payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    const unitFuel = await this.getUnitFuel(locId, unitId, unitFuelId);

    unitFuel.fuelCode = payload.fuelCode;
    unitFuel.indicatorCode = payload.indicatorCode;
    unitFuel.ozoneSeasonIndicator = payload.ozoneSeasonIndicator;
    unitFuel.demGCV = payload.demGCV;
    unitFuel.demSO2 = payload.demSO2;
    unitFuel.beginDate = payload.beginDate;
    unitFuel.endDate = payload.endDate;
    // unitFuel.userId = userId;
    // temporary:
    unitFuel.userId = 'testuser';
    unitFuel.updateDate = new Date(Date.now());

    await this.repository.save(unitFuel);
    return this.getUnitFuel(locId, unitId, unitFuelId);
  }
}
