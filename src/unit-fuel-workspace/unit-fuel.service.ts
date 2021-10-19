import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUnitFuelDTO } from '../dtos/unit-fuel-update.dto';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { v4 as uuid } from 'uuid';

import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelWorkspaceService {
  constructor(
    @InjectRepository(UnitFuelWorkspaceRepository)
    readonly repository: UnitFuelWorkspaceRepository,
    readonly map: UnitFuelMap,
  ) {}

  async getUnitFuels(unitId: number): Promise<UnitFuelDTO[]> {
    const results = await this.repository.find({ unitId });
    return this.map.many(results);
  }

  async getUnitFuel(id: string): Promise<UnitFuelDTO> {
    const result = await this.repository.findOne(id);
    if (!result) {
      throw new NotFoundException('Unit Fuel not found');
    }
    return this.map.one(result);
  }

  async createUnitFuel(
    userId: string,
    unitId: number,
    payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    // temporary:
    const testUserId = 'testuser';
    const load = this.repository.create({
      id: uuid(),
      unitId,
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

    const result = await this.repository.save(load);
    return this.map.one(result);
  }

  async updateUnitFuel(
    userId: string,
    unitFuelId: string,
    unitId: number,
    payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    const unitFuel = await this.getUnitFuel(unitFuelId);

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
    return this.getUnitFuel(unitFuelId);
  }
}
