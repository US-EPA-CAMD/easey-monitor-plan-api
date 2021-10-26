import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUnitControlDTO } from '../dtos/unit-control-update.dto';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';
import { v4 as uuid } from 'uuid';

import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class UnitControlWorkspaceService {
  constructor(
    @InjectRepository(UnitControlWorkspaceRepository)
    readonly repository: UnitControlWorkspaceRepository,
    readonly map: UnitControlMap,
    private Logger: Logger,
  ) {}

  async getUnitControls(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitControlDTO[]> {
    const results = await this.repository.getUnitControls(locId, unitRecordId);
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
      this.Logger.error(NotFoundException, 'Monitor Load Not Found', {
        unitRecordId: unitRecordId,
        unitControlId: unitControlId,
      });
    }
    return this.map.one(result);
  }

  async createUnitControl(
    userId: string,
    locId: string,
    unitRecordId: number,
    payload: UpdateUnitControlDTO,
  ): Promise<UnitControlDTO> {
    // temporary:
    const testUserId = 'testuser';
    const load = this.repository.create({
      id: uuid(),
      unitId: unitRecordId,
      controlCode: payload.controlCode,
      parameterCode: payload.parameterCode,
      installDate: payload.installDate,
      optimizationDate: payload.optimizationDate,
      originalCode: payload.originalCode,
      retireDate: payload.retireDate,
      seasonalControlsIndicator: payload.seasonalControlsIndicator,
      userId: testUserId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);
    return this.map.one(result);
  }

  async updateUnitControl(
    userId: string,
    locId: string,
    unitRecordId: number,
    unitControlId: string,
    payload: UpdateUnitControlDTO,
  ): Promise<UnitControlDTO> {
    const unitControl = await this.getUnitControl(
      locId,
      unitRecordId,
      unitControlId,
    );

    unitControl.controlCode = payload.controlCode;
    unitControl.parameterCode = payload.parameterCode;
    unitControl.installDate = payload.installDate;
    unitControl.optimizationDate = payload.optimizationDate;
    unitControl.originalCode = payload.originalCode;
    unitControl.retireDate = payload.retireDate;
    unitControl.seasonalControlsIndicator = payload.seasonalControlsIndicator;
    // unitControl.userId = userId;
    // temporary:
    unitControl.userId = 'testuser';
    unitControl.updateDate = new Date(Date.now());

    await this.repository.save(unitControl);
    return this.getUnitControl(locId, unitRecordId, unitControlId);
  }
}
