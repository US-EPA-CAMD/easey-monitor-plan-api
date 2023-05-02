import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitControlBaseDTO, UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitControlWorkspaceRepository } from './unit-control.repository';

@Injectable()
export class UnitControlWorkspaceService {
  constructor(
    @InjectRepository(UnitControlWorkspaceRepository)
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
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const unitControl of unitControls) {
        promises.push(
          new Promise(async innerResolve => {
            const unitControlRecord = await this.repository.getUnitControlBySpecs(
              unitRecordId,
              unitControl.parameterCode,
              unitControl.controlCode,
              unitControl.installDate,
              unitControl.retireDate,
            );

            if (unitControlRecord) {
              await this.updateUnitControl(
                locationId,
                unitRecordId,
                unitControlRecord.id,
                unitControl,
                userId,
                true,
              );
            } else {
              await this.createUnitControl(
                locationId,
                unitRecordId,
                unitControl,
                userId,
                true,
              );
            }

            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);

      resolve(true);
    });
  }

  async createUnitControl(
    locationId: string,
    unitRecordId: number,
    payload: UnitControlBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<UnitControlDTO> {
    const unitControl = this.repository.create({
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
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(unitControl);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async updateUnitControl(
    locationId: string,
    unitRecordId: number,
    unitControlId: string,
    payload: UnitControlBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<UnitControlDTO> {
    const unitControl = await this.repository.getUnitControl(unitControlId);

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

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(unitControl);
  }
}
