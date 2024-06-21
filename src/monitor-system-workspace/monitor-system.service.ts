import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import {
  MonitorSystemDTO,
  UpdateMonitorSystemDTO,
} from '../dtos/monitor-system.dto';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemComponentWorkspaceService } from '../system-component-workspace/system-component.service';
import { SystemFuelFlowWorkspaceService } from '../system-fuel-flow-workspace/system-fuel-flow.service';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { withTransaction } from '../utils';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';

@Injectable()
export class MonitorSystemWorkspaceService {
  constructor(
    private readonly repository: MonitorSystemWorkspaceRepository,
    private readonly usedIdRepo: UsedIdentifierRepository,

    private readonly map: MonitorSystemMap,

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
    systems: UpdateMonitorSystemDTO[],
    monitorLocationId?: string,
  ) {
    const errorList: string[] = [];

    const validTypeCodes = ['LTGS', 'LTOL', 'OILM', 'OILV', 'GAS'];

    const componentIdSet: Set<string> = new Set<string>();
    for (const loc of monPlan.monitoringLocationData) {
      for (const component of loc.componentData) {
        componentIdSet.add(component.componentId);
      }
    }

    for (const system of systems) {
      const sys =
        monitorLocationId &&
        (await this.repository.findOneBy({
          locationId: monitorLocationId,
          monitoringSystemId: system.monitoringSystemId,
        }));

      if (sys && sys.systemTypeCode !== system.systemTypeCode) {
        errorList.push(
          `[IMPORT5-CRIT1-A] The system type ${system.systemTypeCode} for UnitStackPipeID ${monitorLocation.unitId}/${monitorLocation.stackPipeId} and MonitoringSystemID ${system.monitoringSystemId} does not match the system type in the Workspace database.`,
        );
      }

      if (
        system.monitoringSystemComponentData &&
        system.monitoringSystemComponentData.length > 0
      ) {
        for (const systemComponent of system.monitoringSystemComponentData) {
          if (!componentIdSet.has(systemComponent.componentId)) {
            errorList.push(
              `[IMPORT7-CRIT1-A] The workspace database and Monitor Plan Import JSON File does not contain a Component record for ${systemComponent.componentId}`,
            );
          }
        }
      }

      if (
        system.monitoringSystemFuelFlowData &&
        system.monitoringSystemFuelFlowData.length > 0
      ) {
        if (sys && !validTypeCodes.includes(sys.systemTypeCode)) {
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

  async getSystem(
    monitoringSystemRecordId: string,
    trx?: EntityManager,
  ): Promise<MonitorSystem> {
    return withTransaction(this.repository, trx).findOneBy({
      id: monitoringSystemRecordId,
    });
  }

  async createSystem({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: UpdateMonitorSystemDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorSystemDTO> {
    const repository = withTransaction(this.repository, trx);

    const system = repository.create({
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

    await repository.save(system);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(system);
  }

  private async importSysComponentAndFuelFlow(
    systemRecordId: string,
    system: UpdateMonitorSystemDTO,
    locationId: string,
    userId: string,
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];

        if (
          system.monitoringSystemComponentData &&
          system.monitoringSystemComponentData.length > 0
        ) {
          promises.push(
            this.systemComponentService.importSystemComponent(
              locationId,
              systemRecordId,
              system.monitoringSystemComponentData,
              userId,
              trx,
            ),
          );
        }

        if (
          system.monitoringSystemFuelFlowData &&
          system.monitoringSystemFuelFlowData.length > 0
        ) {
          promises.push(
            this.systemFuelFlowService.importFuelFlow(
              locationId,
              systemRecordId,
              system.monitoringSystemFuelFlowData,
              userId,
              trx,
            ),
          );
        }

        await Promise.all(promises);

        resolve(true);
      })();
    });
  }

  async updateSystem({
    monitoringSystemRecordId,
    payload,
    locationId,
    userId,
    isImport = false,
    trx,
  }: {
    monitoringSystemRecordId: string;
    payload: UpdateMonitorSystemDTO;
    locationId: string;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorSystemDTO> {
    const system = await this.getSystem(monitoringSystemRecordId, trx);
    system.systemTypeCode = payload.systemTypeCode;
    system.systemDesignationCode = payload.systemDesignationCode;
    system.fuelCode = payload.fuelCode;
    system.beginDate = payload.beginDate;
    system.beginHour = payload.beginHour;
    system.endDate = payload.endDate;
    system.endHour = payload.endHour;
    system.userId = userId;
    system.updateDate = currentDateTime();

    await withTransaction(this.repository, trx).save(system);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(system);
  }

  async importSystem(
    systems: UpdateMonitorSystemDTO[],
    locationId: string,
    userId: string,
    trx?: EntityManager,
  ) {
    const repository = withTransaction(this.repository, trx);

    return new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const system of systems) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const innerPromises = [];
                let systemRecord = await repository.getSystemByLocIdSysIdentifier(
                  locationId,
                  system.monitoringSystemId,
                );

                if (!systemRecord) {
                  // Check used_identifier table to see if the sysIdentifier has already
                  // been used, and if so grab that monitor-system record for update
                  let usedIdentifier = await withTransaction(
                    this.usedIdRepo,
                    trx,
                  ).getBySpecs(locationId, system.monitoringSystemId, 'S');

                  if (usedIdentifier)
                    systemRecord = await repository.findOneBy({
                      id: usedIdentifier.id,
                    });
                }

                if (systemRecord) {
                  await this.updateSystem({
                    monitoringSystemRecordId: systemRecord.id,
                    payload: system,
                    locationId,
                    userId,
                    isImport: true,
                    trx,
                  });

                  innerPromises.push(
                    this.importSysComponentAndFuelFlow(
                      systemRecord.id,
                      system,
                      locationId,
                      userId,
                      trx,
                    ),
                  );
                } else {
                  const createdSystemRecord = await this.createSystem({
                    locationId,
                    payload: system,
                    userId,
                    isImport: true,
                    trx,
                  });

                  innerPromises.push(
                    this.importSysComponentAndFuelFlow(
                      createdSystemRecord.id,
                      system,
                      locationId,
                      userId,
                      trx,
                    ),
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
