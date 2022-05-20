import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import {
  SystemFuelFlowBaseDTO,
  SystemFuelFlowDTO,
} from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class SystemFuelFlowWorkspaceService {
  constructor(
    @InjectRepository(SystemFuelFlowWorkspaceRepository)
    private readonly repository: SystemFuelFlowWorkspaceRepository,
    private readonly map: SystemFuelFlowMap,
    private readonly logger: Logger,

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
      this.logger.error(NotFoundException, 'Fuel Flow not found.', true, {
        fuelFlowId: fuelFlowId,
      });
    }

    return result;
  }

  async createFuelFlow(
    monitoringSystemRecordId: string,
    payload: SystemFuelFlowBaseDTO,
    locId: string,
    userId: string,
  ): Promise<SystemFuelFlowDTO> {
    const fuelFlow = this.repository.create({
      id: uuid(),
      monitoringSystemRecordId: monitoringSystemRecordId,
      maximumFuelFlowRate: payload.maximumFuelFlowRate,
      maximumFuelFlowRateSourceCode: payload.maximumFuelFlowRateSourceCode,
      systemFuelFlowUOMCode: payload.systemFuelFlowUOMCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(fuelFlow);
    const getFuelFlow = await this.getFuelFlow(fuelFlow.id);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(getFuelFlow);
  }

  async updateFuelFlow(
    fuelFlowId: string,
    payload: SystemFuelFlowBaseDTO,
    locId: string,
    userId: string,
  ): Promise<SystemFuelFlowDTO> {
    const fuelFlow = await this.getFuelFlow(fuelFlowId);

    fuelFlow.maximumFuelFlowRate = payload.maximumFuelFlowRate;
    fuelFlow.systemFuelFlowUOMCode = payload.systemFuelFlowUOMCode;
    fuelFlow.maximumFuelFlowRateSourceCode =
      payload.maximumFuelFlowRateSourceCode;
    fuelFlow.beginDate = payload.beginDate;
    fuelFlow.endDate = payload.endDate;
    fuelFlow.beginHour = payload.beginHour;
    fuelFlow.endHour = payload.endHour;

    await this.repository.save(fuelFlow);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(fuelFlow);
  }

  async importFuelFlow(
    locationId: string,
    sysId: string,
    systemFuelFlows: SystemFuelFlowBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const fuelFlow of systemFuelFlows) {
        promises.push(
          new Promise(async innerResolve => {
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
                ),
              );
            } else {
              innerPromises.push(
                await this.createFuelFlow(sysId, fuelFlow, locationId, userId),
              );
            }

            await Promise.all(innerPromises);
            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }
}
