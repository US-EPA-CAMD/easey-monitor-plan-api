import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUnitControlDTO } from 'src/dtos/unit-control-update.dto';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';
import { v4 as uuid } from 'uuid';

import { UnitControlWorkspaceRepository } from './unit-control.repository';

@Injectable()
export class UnitControlWorkspaceService {
  constructor(
    @InjectRepository(UnitControlWorkspaceRepository)
    private repository: UnitControlWorkspaceRepository,
    private map: UnitControlMap,
  ) {}

  async getUnitControls(unitId: number): Promise<UnitControlDTO[]> {
    const results = await this.repository.find({ unitId });
    return this.map.many(results);
  }

  async getUnitControl(id: string): Promise<UnitControlDTO> {
    const result = await this.repository.findOne(id);
    if (!result) {
      throw new NotFoundException('Monitor Load not found');
    }
    return this.map.one(result);
  }

  async createUnitControl(
    userId: string,
    unitId: number,
    payload: UpdateUnitControlDTO,
  ): Promise<UnitControlDTO> {
    const load = this.repository.create({
      id: uuid(),
      unitId,
      controlCode: payload.controlCode,
      parameterCode: payload.parameterCode,
      installDate: payload.installDate,
      optimizationDate: payload.optimizationDate,
      originalCode: payload.originalCode,
      retireDate: payload.retireDate,
      seasonalControlsIndicator: payload.seasonalControlsIndicator,
      userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);
    return this.map.one(result);
  }

  async updateUnitControl(
    userId: string,
    unitControlId: string,
    unitId: number,
    payload: UpdateUnitControlDTO,
  ): Promise<UnitControlDTO> {
    const unitControl = await this.getUnitControl(unitControlId);

    unitControl.controlCode = payload.controlCode;
    unitControl.parameterCode = payload.parameterCode;
    unitControl.installDate = payload.installDate;
    unitControl.optimizationDate = payload.optimizationDate;
    unitControl.originalCode = payload.originalCode;
    unitControl.retireDate = payload.retireDate;
    unitControl.seasonalControlsIndicator = payload.seasonalControlsIndicator;
    unitControl.userId = userId;
    unitControl.updateDate = new Date(Date.now());

    await this.repository.save(unitControl);
    return this.getUnitControl(unitControlId);
  }
}
