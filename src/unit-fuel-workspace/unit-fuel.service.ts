import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { UnitFuelBaseDTO, UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class UnitFuelWorkspaceService {
  constructor(
    @InjectRepository(UnitFuelWorkspaceRepository)
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

  async createUnitFuel(
    locationId: string,
    unitId: number,
    payload: UnitFuelBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<UnitFuelDTO> {
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
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await this.repository.save(unitFuel);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async updateUnitFuel(
    locationId: string,
    unitId: number,
    unitFuelId: string,
    payload: UnitFuelBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<UnitFuelDTO> {
    const unitFuel = await this.repository.findOne(unitFuelId);

    unitFuel.fuelCode = payload.fuelCode;
    unitFuel.indicatorCode = payload.indicatorCode;
    unitFuel.ozoneSeasonIndicator = payload.ozoneSeasonIndicator;
    unitFuel.demGCV = payload.demGCV;
    unitFuel.demSO2 = payload.demSO2;
    unitFuel.beginDate = payload.beginDate;
    unitFuel.endDate = payload.endDate;
    unitFuel.userId = userId;
    unitFuel.updateDate = currentDateTime();

    await this.repository.save(unitFuel);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(unitFuel);
  }

  async importUnitFuel(
    unitFuels: UnitFuelBaseDTO[],
    unitId: number,
    locationId: string,
    userId: string,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const unitFuel of unitFuels) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const unitFuelRecord = await this.repository.getUnitFuelBySpecs(
                  unitId,
                  unitFuel.fuelCode,
                  unitFuel.beginDate,
                  unitFuel.endDate,
                );

                if (unitFuelRecord !== undefined) {
                  await this.updateUnitFuel(
                    locationId,
                    unitId,
                    unitFuelRecord.id,
                    unitFuel,
                    userId,
                    true,
                  );
                } else {
                  await this.createUnitFuel(
                    locationId,
                    unitId,
                    unitFuel,
                    userId,
                    true,
                  );
                }

                innerResolve(true);
              })();
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })();
    });
  }
}
