import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { SystemFuelFlow } from '../entities/workspace/system-fuel-flow.entity';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';

import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import {
  SystemFuelFlowBaseDTO,
  SystemFuelFlowDTO,
} from '../dtos/system-fuel-flow.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';

@Injectable()
export class SystemFuelFlowWorkspaceService {
  constructor(
    private readonly repository: SystemFuelFlowWorkspaceRepository,
    private readonly map: SystemFuelFlowMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlowDTO[]> {
    const results = await this.repository.getFuelFlows(monSysId);
    return this.map.many(results);
  }

  async getFuelFlow(
    fuelFlowId: string,
    trx?: EntityManager,
  ): Promise<SystemFuelFlow> {
    const result = await (
      trx?.withRepository(this.repository) ?? this.repository
    ).getFuelFlow(fuelFlowId);

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

  async createFuelFlow({
    monitoringSystemRecordId,
    payload,
    locationId,
    userId,
    isImport = false,
    trx,
  }: {
    monitoringSystemRecordId: string;
    payload: SystemFuelFlowBaseDTO;
    locationId: string;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<SystemFuelFlowDTO> {
    const repository = trx?.withRepository(this.repository) ?? this.repository;

    const fuelFlow = repository.create({
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

    await repository.save(fuelFlow);
    const getFuelFlow = await this.getFuelFlow(fuelFlow.id, trx);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(getFuelFlow);
  }

  async updateFuelFlow({
    fuelFlowId,
    payload,
    locationId,
    userId,
    isImport = false,
    trx,
  }: {
    fuelFlowId: string;
    payload: SystemFuelFlowBaseDTO;
    locationId: string;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<SystemFuelFlowDTO> {
    const fuelFlow = await this.getFuelFlow(fuelFlowId, trx);

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

    await (trx?.withRepository(this.repository) ?? this.repository).save(
      fuelFlow,
    );

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(fuelFlow);
  }

  async importFuelFlow(
    locationId: string,
    sysId: string,
    systemFuelFlows: SystemFuelFlowBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];
        for (const fuelFlow of systemFuelFlows) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const innerPromises = [];
                const fuelFlowRecord = await (
                  trx?.withRepository(this.repository) ?? this.repository
                ).getFuelFlowByBeginOrEndDate(sysId, fuelFlow);

                if (fuelFlowRecord) {
                  innerPromises.push(
                    await this.updateFuelFlow({
                      fuelFlowId: fuelFlowRecord.id,
                      payload: fuelFlow,
                      locationId,
                      userId,
                      isImport: true,
                      trx,
                    }),
                  );
                } else {
                  innerPromises.push(
                    await this.createFuelFlow({
                      monitoringSystemRecordId: sysId,
                      payload: fuelFlow,
                      locationId,
                      userId,
                      isImport: true,
                      trx,
                    }),
                  );
                }

                await Promise.all(innerPromises);
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
