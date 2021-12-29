import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUnitControlDTO } from '../dtos/unit-control-update.dto';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';
import { v4 as uuid } from 'uuid';

import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class UnitControlWorkspaceService {
  constructor(
    @InjectRepository(UnitControlWorkspaceRepository)
    readonly repository: UnitControlWorkspaceRepository,
    readonly map: UnitControlMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getUnitControls(
    locId: string,
    unitId: number,
  ): Promise<UnitControlDTO[]> {
    let result;
    try {
      result = await this.repository.getUnitControls(locId, unitId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getUnitControl(
    locId: string,
    unitId: number,
    unitControlId: string,
  ): Promise<UnitControlDTO> {
    let result;
    try {
      result = await this.repository.getUnitControl(
        locId,
        unitId,
        unitControlId,
      );
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Load Not Found', true, {
        unitId: unitId,
        unitControlId: unitControlId,
      });
    }
    return this.map.one(result);
  }

  async createUnitControl(
    userId: string,
    locId: string,
    unitId: number,
    payload: UpdateUnitControlDTO,
  ): Promise<UnitControlDTO> {
    let result;
    try {
      const load = this.repository.create({
        id: uuid(),
        unitId: unitId,
        controlCode: payload.controlCode,
        parameterCode: payload.parameterCode,
        installDate: payload.installDate,
        optimizationDate: payload.optimizationDate,
        originalCode: payload.originalCode,
        retireDate: payload.retireDate,
        seasonalControlsIndicator: payload.seasonalControlsIndicator,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      result = await this.repository.save(load);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }

  async updateUnitControl(
    userId: string,
    locId: string,
    unitId: number,
    unitControlId: string,
    payload: UpdateUnitControlDTO,
  ): Promise<UnitControlDTO> {
    try {
      const unitControl = await this.getUnitControl(
        locId,
        unitId,
        unitControlId,
      );

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
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getUnitControl(locId, unitId, unitControlId);
  }
}
