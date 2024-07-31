import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { UnitControlBaseDTO, UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { UnitControlWorkspaceRepository } from './unit-control.repository';

@Injectable()
export class UnitControlWorkspaceService {
  constructor(
    private readonly repository: UnitControlWorkspaceRepository,
    private readonly map: UnitControlMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getUnitControls(
    locId: string,
    unitId: number,
  ): Promise<UnitControlDTO[]> {
    const results = await this.repository.getUnitControls(locId, unitId);
    return this.map.many(results);
  }

  async importUnitControl(
    unitControls: UnitControlBaseDTO[],
    unitRecordId: number,
    locationId: string,
    userId: string,
    trx?: EntityManager,
  ) {
    await Promise.all(
      unitControls.map(async unitControl => {
        const unitControlRecord = await withTransaction(
          this.repository,
          trx,
        ).getUnitControlBySpecs(
          unitRecordId,
          unitControl.parameterCode,
          unitControl.controlCode,
          unitControl.installDate,
          unitControl.retireDate,
        );

        if (unitControlRecord) {
          await this.updateUnitControl({
            locationId,
            unitRecordId,
            unitControlId: unitControlRecord.id,
            payload: unitControl,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createUnitControl({
            locationId,
            unitRecordId,
            payload: unitControl,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
    return true;
  }

  async createUnitControl({
    locationId,
    unitRecordId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    unitRecordId: number;
    payload: UnitControlBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<UnitControlDTO> {
    const repository = withTransaction(this.repository, trx);

    const unitControl = repository.create({
      id: uuid(),
      unitId: unitRecordId,
      controlCode: payload.controlCode,
      parameterCode: payload.parameterCode,
      installDate: payload.installDate,
      optimizationDate: payload.optimizationDate,
      originalCode: payload.originalCode,
      retireDate: payload.retireDate,
      seasonalControlsIndicator: payload.seasonalControlsIndicator,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(unitControl);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }

  async updateUnitControl({
    locationId,
    unitRecordId,
    unitControlId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    unitRecordId: number;
    unitControlId: string;
    payload: UnitControlBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<UnitControlDTO> {
    const repository = withTransaction(this.repository, trx);

    const unitControl = await repository.getUnitControl(unitControlId);

    unitControl.controlCode = payload.controlCode;
    unitControl.parameterCode = payload.parameterCode;
    unitControl.installDate = payload.installDate;
    unitControl.optimizationDate = payload.optimizationDate;
    unitControl.originalCode = payload.originalCode;
    unitControl.retireDate = payload.retireDate;
    unitControl.seasonalControlsIndicator = payload.seasonalControlsIndicator;
    unitControl.userId = userId;
    unitControl.updateDate = currentDateTime();

    await repository.save(unitControl);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(unitControl);
  }
}
