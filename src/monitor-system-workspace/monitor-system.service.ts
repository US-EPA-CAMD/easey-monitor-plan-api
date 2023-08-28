import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import {
  MonitorSystemBaseDTO,
  MonitorSystemDTO,
  UpdateMonitorSystemDTO,
} from '../dtos/monitor-system.dto';
import { MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemComponentWorkspaceService } from '../system-component-workspace/system-component.service';
import { SystemFuelFlowWorkspaceService } from '../system-fuel-flow-workspace/system-fuel-flow.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class MonitorSystemWorkspaceService {
  constructor(
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly repository: MonitorSystemWorkspaceRepository,

    @InjectRepository(UsedIdentifierRepository)
    private readonly usedIdRepo: UsedIdentifierRepository,

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
    systems: UpdateMonitorSystemDTO[],
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

      if (system.fuelFlows && system.fuelFlows.length > 0) {
        if (Sys && !validTypeCodes.includes(Sys.systemTypeCode)) {
          errorList.push(
            '[IMPORT31-CRIT1-A] You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
          );
        } else {
          if (!validTypeCodes.includes(system.systemTypeCode)) {
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
    payload: UpdateMonitorSystemDTO,
    userId: string,
    isImport = false,
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
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await this.repository.save(system);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(system);
  }

  private async importSysComponentAndFuelFlow(
    systemRecordId: string,
    system: UpdateMonitorSystemDTO,
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      if (system.components && system.components.length > 0) {
        promises.push(
          this.systemComponentService.importSystemComponent(
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
    locationId: string,
    userId: string,
    isImport = false,
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
    system.updateDate = currentDateTime();

    await this.repository.save(system);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(system);
  }

  async importSystem(
    systems: UpdateMonitorSystemDTO[],
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const system of systems) {
        promises.push(
          new Promise(async innerResolve => {
            const innerPromises = [];
            let systemRecord = await this.repository.getSystemByLocIdSysIdentifier(
              locationId,
              system.monitoringSystemId,
            );

            if (systemRecord === undefined) {
              // Check used_identifier table to see if the sysIdentifier has already
              // been used, and if so grab that monitor-system record for update
              let usedIdentifier = await this.usedIdRepo.getBySpecs(
                locationId,
                system.monitoringSystemId,
                'S',
              );

              if (usedIdentifier)
                systemRecord = await this.repository.findOne({
                  id: usedIdentifier.id,
                });
            }

            if (systemRecord !== undefined) {
              await this.updateSystem(
                systemRecord.id,
                system,
                locationId,
                userId,
                true,
              );

              innerPromises.push(
                this.importSysComponentAndFuelFlow(
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
                true,
              );

              innerPromises.push(
                this.importSysComponentAndFuelFlow(
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
