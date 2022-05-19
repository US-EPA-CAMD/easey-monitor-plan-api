import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitFuelBaseDTO, UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelWorkspaceService {
  constructor(
    @InjectRepository(UnitFuelWorkspaceRepository)
    private readonly repository: UnitFuelWorkspaceRepository,
    private readonly map: UnitFuelMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getUnitFuels(locId: string, unitId: number): Promise<UnitFuelDTO[]> {
    const results = await this.repository.getUnitFuels(locId, unitId);
    return this.map.many(results);
  }

  async importUnitFuel(
    unitFuels: UnitFuelBaseDTO[],
    unitId: number,
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const unitFuel of unitFuels) {
        promises.push(
          new Promise(async innerResolve => {
            const unitFuelRecord = await this.repository.getUnitFuelBySpecs(
              unitId,
              unitFuel.fuelCode,
              unitFuel.beginDate,
              unitFuel.endDate,
            );

            if (unitFuelRecord !== undefined) {
              await this.updateUnitFuel(
                userId,
                locationId,
                unitId,
                unitFuelRecord.id,
                unitFuel,
              );
            } else {
              await this.createUnitFuel(userId, locationId, unitId, unitFuel);
            }

            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }

  async getUnitFuel(
    locId: string,
    unitId: number,
    unitFuelId: string,
  ): Promise<UnitFuelDTO> {
    const result = await this.repository.getUnitFuel(locId, unitId, unitFuelId);
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
    payload: UnitFuelBaseDTO,
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
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(unitFuel);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }

  async updateUnitFuel(
    userId: string,
    locId: string,
    unitId: number,
    unitFuelId: string,
    payload: UnitFuelBaseDTO,
  ): Promise<UnitFuelDTO> {
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
    return this.getUnitFuel(locId, unitId, unitFuelId);
  }
}
