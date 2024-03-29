import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import {
  SystemFuelFlowBaseDTO,
  SystemFuelFlowDTO,
} from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class SystemFuelFlowWorkspaceService {
  constructor(
    @InjectRepository(SystemFuelFlowWorkspaceRepository)
    private readonly repository: SystemFuelFlowWorkspaceRepository,
    private readonly map: SystemFuelFlowMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlowDTO[]> {
    const results = await this.repository.getFuelFlows(monSysId);
    return this.map.many(results);
  }

  async getFuelFlow(fuelFlowId: string): Promise<SystemFuelFlow> {
    const result = await this.repository.getFuelFlow(fuelFlowId);

    if (!result) {
      throw new EaseyException(
        new Error('Fuel Flow not found.'),
        HttpStatus.NOT_FOUND,
        {
          fuelFlowId: fuelFlowId,
        },
      );
    }

    return result;
  }

  async createFuelFlow(
    monitoringSystemRecordId: string,
    payload: SystemFuelFlowBaseDTO,
    locationId: string,
    userId: string,
    isImport = false,
  ): Promise<SystemFuelFlowDTO> {
    const fuelFlow = this.repository.create({
      id: uuid(),
      monitoringSystemRecordId: monitoringSystemRecordId,
      maximumFuelFlowRate: payload.maximumFuelFlowRate,
      maximumFuelFlowRateSourceCode: payload.maximumFuelFlowRateSourceCode,
      systemFuelFlowUOMCode: payload.systemFuelFlowUnitsOfMeasureCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await this.repository.save(fuelFlow);
    const getFuelFlow = await this.getFuelFlow(fuelFlow.id);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(getFuelFlow);
  }

  async updateFuelFlow(
    fuelFlowId: string,
    payload: SystemFuelFlowBaseDTO,
    locationId: string,
    userId: string,
    isImport = false,
  ): Promise<SystemFuelFlowDTO> {
    const fuelFlow = await this.getFuelFlow(fuelFlowId);

    fuelFlow.maximumFuelFlowRate = payload.maximumFuelFlowRate;
    fuelFlow.systemFuelFlowUOMCode = payload.systemFuelFlowUnitsOfMeasureCode;
    fuelFlow.maximumFuelFlowRateSourceCode =
      payload.maximumFuelFlowRateSourceCode;
    fuelFlow.beginDate = payload.beginDate;
    fuelFlow.endDate = payload.endDate;
    fuelFlow.beginHour = payload.beginHour;
    fuelFlow.endHour = payload.endHour;
    fuelFlow.userId = userId;
    fuelFlow.updateDate = currentDateTime();

    await this.repository.save(fuelFlow);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(fuelFlow);
  }

  async importFuelFlow(
    locationId: string,
    sysId: string,
    systemFuelFlows: SystemFuelFlowBaseDTO[],
    userId: string,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];
        for (const fuelFlow of systemFuelFlows) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const innerPromises = [];
                const fuelFlowRecord = await this.repository.getFuelFlowByBeginOrEndDate(
                  sysId,
                  fuelFlow,
                );

                if (fuelFlowRecord) {
                  innerPromises.push(
                    await this.updateFuelFlow(
                      fuelFlowRecord.id,
                      fuelFlow,
                      locationId,
                      userId,
                      true,
                    ),
                  );
                } else {
                  innerPromises.push(
                    await this.createFuelFlow(
                      sysId,
                      fuelFlow,
                      locationId,
                      userId,
                      true,
                    ),
                  );
                }

                await Promise.all(innerPromises);
                innerResolve(true);
              })()
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })()
    });
  }
}
