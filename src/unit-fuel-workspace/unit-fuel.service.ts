import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { UnitFuelBaseDTO, UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelWorkspaceService {
  constructor(
    private readonly repository: UnitFuelWorkspaceRepository,
    private readonly map: UnitFuelMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getUnitFuels(locId: string, unitId: number): Promise<UnitFuelDTO[]> {
    const results = await this.repository.getUnitFuels(locId, unitId);
    return this.map.many(results);
  }

  async getUnitFuel(
    locId: string,
    unitId: number,
    unitFuelId: string,
  ): Promise<UnitFuelDTO> {
    const result = await this.repository.getUnitFuel(unitFuelId);

    if (!result) {
      throw new EaseyException(
        new Error('Unit Fuel Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locId: locId,
          unitId: unitId,
          unitFuelId: unitFuelId,
        },
      );
    }

    return this.map.one(result);
  }

  async createUnitFuel({
    locationId,
    unitId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    unitId: number;
    payload: UnitFuelBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<UnitFuelDTO> {
    const repository = withTransaction(this.repository, trx);

    const unitFuel = repository.create({
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
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(unitFuel);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }

  async updateUnitFuel({
    locationId,
    unitFuelId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    unitFuelId: string;
    payload: UnitFuelBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<UnitFuelDTO> {
    const repository = withTransaction(this.repository, trx);

    const unitFuel = await repository.findOneBy({ id: unitFuelId });

    unitFuel.fuelCode = payload.fuelCode;
    unitFuel.indicatorCode = payload.indicatorCode;
    unitFuel.ozoneSeasonIndicator = payload.ozoneSeasonIndicator;
    unitFuel.demGCV = payload.demGCV;
    unitFuel.demSO2 = payload.demSO2;
    unitFuel.beginDate = payload.beginDate;
    unitFuel.endDate = payload.endDate;
    unitFuel.userId = userId;
    unitFuel.updateDate = currentDateTime();

    await repository.save(unitFuel);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(unitFuel);
  }

  async importUnitFuel(
    unitFuels: UnitFuelBaseDTO[],
    unitId: number,
    locationId: string,
    userId: string,
    trx?: EntityManager,
  ) {
    return Promise.all(
      unitFuels.map(async unitFuel => {
        const unitFuelRecord = await withTransaction(
          this.repository,
          trx,
        ).getUnitFuelBySpecs(
          unitId,
          unitFuel.fuelCode,
          unitFuel.beginDate,
          unitFuel.endDate,
        );

        if (unitFuelRecord) {
          await this.updateUnitFuel({
            locationId,
            unitFuelId: unitFuelRecord.id,
            payload: unitFuel,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createUnitFuel({
            locationId,
            unitId,
            payload: unitFuel,
            userId,
            isImport: true,
          });
        }
      }),
    );
  }
}
