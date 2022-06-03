import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import {
  MonitorSystemBaseDTO,
  MonitorSystemDTO,
} from '../dtos/monitor-system.dto';
import { MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemComponentWorkspaceService } from '../system-component-workspace/system-component.service';
import { SystemFuelFlowWorkspaceService } from '../system-fuel-flow-workspace/system-fuel-flow.service';
import { checkComponentExistanceInFile } from '../import-checks/utilities/utils';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';

@Injectable()
export class MonitorSystemWorkspaceService {
  constructor(
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly repository: MonitorSystemWorkspaceRepository,
    private readonly map: MonitorSystemMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,

    @Inject(forwardRef(() => ComponentWorkspaceService))
    private readonly componentService: ComponentWorkspaceService,

    private readonly systemComponentService: SystemComponentWorkspaceService,
    private readonly systemFuelFlowService: SystemFuelFlowWorkspaceService,
  ) {}

  async runMonitorSystemImportCheck(
    monPlan: UpdateMonitorPlanDTO,
    monitorLocation: UpdateMonitorLocationDTO,
    monitorLocationId: string,
    systems: MonitorSystemBaseDTO[],
  ) {
    const errorList: string[] = [];

    const validTypeCodes = ['LTGS', 'LTOL', 'OILM', 'OILV', 'GAS'];

    const componentIdAndTypeCodeSet: Set<string> = new Set<string>();
    for (const loc of monPlan.locations) {
      for (const component of loc.components) {
        componentIdAndTypeCodeSet.add(
          `${component.componentId}:${component.componentTypeCode}`,
        );
      }
    }

    for (const system of systems) {
      const Sys = await this.repository.findOne({
        locationId: monitorLocationId,
        monitoringSystemId: system.monitoringSystemId,
      });

      if (Sys && Sys.systemTypeCode !== system.systemTypeCode) {
        errorList.push(
          `[IMPORT5-CRIT1-A] The system type ${system.systemTypeCode} for UnitStackPipeID ${monitorLocation.unitId}/${monitorLocation.stackPipeId} and MonitoringSystemID ${system.monitoringSystemId} does not match the system type in the Workspace database.`,
        );
      }

      if (system.components && system.components.length > 0) {
        for (const systemComponent of system.components) {
          const Comp = await this.componentService.getComponentByIdentifier(
            monitorLocationId,
            systemComponent.componentId,
          );

          if (!Comp) {
            if (
              !componentIdAndTypeCodeSet.has(
                `${systemComponent.componentId}:${systemComponent.componentTypeCode}`,
              )
            ) {
              errorList.push(
                `[IMPORT7-CRIT1-A] The workspace database and Monitor Plan Import JSON File does not contain a Component record for ${systemComponent.componentId}`,
              );
            }
          }
        }
      }

      if (system.fuelFlows && system.fuelFlows.length > 0) {
        if (!validTypeCodes.includes(system.systemTypeCode)) {
          errorList.push(
            '[IMPORT31-CRIT1-A] You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
          );
        } else {
          if (Sys && !validTypeCodes.includes(Sys.systemTypeCode)) {
            errorList.push(
              '[IMPORT31-CRIT1-A] You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
            );
          }
        }
      }
    }
    return errorList;
  }

  async getSystems(locationId: string): Promise<MonitorSystemDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        monitoringSystemId: 'ASC',
      },
    });
    return this.map.many(results);
  }

  async getSystem(monitoringSystemRecordId: string): Promise<MonitorSystem> {
    return this.repository.findOne(monitoringSystemRecordId);
  }

  async createSystem(
    locationId: string,
    payload: MonitorSystemBaseDTO,
    userId: string,
  ): Promise<MonitorSystemDTO> {
    const system = this.repository.create({
      id: uuid(),
      locationId,
      monitoringSystemId: payload.monitoringSystemId,
      systemDesignationCode: payload.systemDesignationCode,
      fuelCode: payload.fuelCode,
      systemTypeCode: payload.systemTypeCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(system);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(system);
  }

  private async updateSysComponentAndFuelFlow(
    systemRecordId: string,
    system: MonitorSystemBaseDTO,
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      if (system.components && system.components.length > 0) {
        promises.push(
          this.systemComponentService.importComponent(
            locationId,
            systemRecordId,
            system.components,
            userId,
          ),
        );
      }

      if (system.fuelFlows && system.fuelFlows.length > 0) {
        promises.push(
          this.systemFuelFlowService.importFuelFlow(
            locationId,
            systemRecordId,
            system.fuelFlows,
            userId,
          ),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }

  async updateSystem(
    monitoringSystemRecordId: string,
    payload: MonitorSystemBaseDTO,
    locId: string,
    userId: string,
  ): Promise<MonitorSystemDTO> {
    const system = await this.getSystem(monitoringSystemRecordId);
    system.systemTypeCode = payload.systemTypeCode;
    system.systemDesignationCode = payload.systemDesignationCode;
    system.fuelCode = payload.fuelCode;
    system.beginDate = payload.beginDate;
    system.beginHour = payload.beginHour;
    system.endDate = payload.endDate;
    system.endHour = payload.endHour;
    system.userId = userId;
    system.updateDate = new Date(Date.now());

    await this.repository.save(system);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(system);
  }

  async importSystem(
    systems: MonitorSystemBaseDTO[],
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const system of systems) {
        promises.push(
          new Promise(async innerResolve => {
            const innerPromises = [];
            const systemRecord = await this.repository.getSystemByLocIdSysIdentifier(
              locationId,
              system.monitoringSystemId,
            );

            if (systemRecord !== undefined) {
              await this.updateSystem(
                systemRecord.id,
                system,
                locationId,
                userId,
              );

              innerPromises.push(
                this.updateSysComponentAndFuelFlow(
                  systemRecord.id,
                  system,
                  locationId,
                  userId,
                ),
              );
            } else {
              const createdSystemRecord = await this.createSystem(
                locationId,
                system,
                userId,
              );
              innerPromises.push(
                this.updateSysComponentAndFuelFlow(
                  createdSystemRecord.id,
                  system,
                  locationId,
                  userId,
                ),
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
