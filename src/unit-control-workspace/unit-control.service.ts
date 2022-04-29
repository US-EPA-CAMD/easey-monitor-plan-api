import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitControlBaseDTO } from '../dtos/unit-control.dto';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';
import { v4 as uuid } from 'uuid';

import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UpdateMonitorLocationDTO } from 'src/dtos/monitor-location-update.dto';

@Injectable()
export class UnitControlWorkspaceService {
  constructor(
    @InjectRepository(UnitControlWorkspaceRepository)
    private readonly repository: UnitControlWorkspaceRepository,
    private readonly map: UnitControlMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getUnitControls(
    locId: string,
    unitId: number,
  ): Promise<UnitControlDTO[]> {
    const results = await this.repository.getUnitControls(locId, unitId);
    return this.map.many(results);
  }

  async getUnitControl(
    locId: string,
    unitRecordId: number,
    unitControlId: string,
  ): Promise<UnitControlDTO> {
    const result = await this.repository.getUnitControl(
      locId,
      unitRecordId,
      unitControlId,
    );
    if (!result) {
      this.logger.error(NotFoundException, 'Unit Control Not Found', true, {
        unitRecordId,
        unitControlId,
      });
    }
    return this.map.one(result);
  }

  async importUnitControl(
    location: UpdateMonitorLocationDTO,
    unitId: number,
    locationId: string,
    userId: string,
  ) {
    for (const unitControl of location.unitControls) {
      new Promise(async () => {
        const unitControlRecord = await this.repository.getUnitControlBySpecs(
          unitId,
          unitControl.controlEquipParamCode,
          unitControl.controlCode,
          unitControl.installDate,
          unitControl.retireDate,
        );

        if (unitControlRecord !== undefined) {
          this.updateUnitControl(
            userId,
            locationId,
            unitId,
            unitControlRecord.id,
            unitControl,
          );
        } else {
          this.createUnitControl(userId, locationId, unitId, unitControl);
        }
      });
    }
  }

  async createUnitControl(
    userId: string,
    locId: string,
    unitId: number,
    payload: UnitControlBaseDTO,
  ): Promise<UnitControlDTO> {
    const load = this.repository.create({
      id: uuid(),
      unitId: unitId,
      controlCode: payload.controlCode,
      controlEquipParamCode: payload.controlEquipParamCode,
      installDate: payload.installDate,
      optimizationDate: payload.optimizationDate,
      originalCode: payload.originalCode,
      retireDate: payload.retireDate,
      seasonalControlsIndicator: payload.seasonalControlsIndicator,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }

  async updateUnitControl(
    userId: string,
    locId: string,
    unitId: number,
    unitControlId: string,
    payload: UnitControlBaseDTO,
  ): Promise<UnitControlDTO> {
    const unitControl = await this.getUnitControl(locId, unitId, unitControlId);

    unitControl.controlCode = payload.controlCode;
    unitControl.controlEquipParamCode = payload.controlEquipParamCode;
    unitControl.installDate = payload.installDate;
    unitControl.optimizationDate = payload.optimizationDate;
    unitControl.originalCode = payload.originalCode;
    unitControl.retireDate = payload.retireDate;
    unitControl.seasonalControlsIndicator = payload.seasonalControlsIndicator;
    unitControl.userId = userId;
    unitControl.updateDate = new Date(Date.now());

    await this.repository.save(unitControl);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.getUnitControl(locId, unitId, unitControlId);
  }
}
