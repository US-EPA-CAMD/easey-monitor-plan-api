import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { getMonLocId } from '../import-checks/utilities/utils';

import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

import { UnitService } from '../unit/unit.service';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { UnitCapacityWorkspaceService } from '../unit-capacity-workspace/unit-capacity.service';
import { UnitControlWorkspaceService } from '../unit-control-workspace/unit-control.service';
import { UnitFuelWorkspaceService } from '../unit-fuel-workspace/unit-fuel.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MonitorSystemWorkspaceService } from '../monitor-system-workspace/monitor-system.service';
import { MatsMethodWorkspaceService } from '../mats-method-workspace/mats-method.service';

@Injectable()
export class MonitorLocationWorkspaceService {
  readonly errorMsg: 'Monitor Location Not Found';
  constructor(
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly repository: MonitorLocationWorkspaceRepository,
    private readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationWorkspaceService,
    private readonly unitService: UnitService,
    private readonly componentService: ComponentWorkspaceService,
    private readonly unitCapacityService: UnitCapacityWorkspaceService,
    private readonly unitControlService: UnitControlWorkspaceService,
    private readonly unitFuelService: UnitFuelWorkspaceService,
    private readonly qualificationService: MonitorQualificationWorkspaceService,
    private readonly systemService: MonitorSystemWorkspaceService,
    private readonly matsMethodService: MatsMethodWorkspaceService,
    private readonly logger: Logger,
  ) {}

  async getMonitorLocationsByFacilityAndOris(
    plan: UpdateMonitorPlanDTO,
    facilitId: number,
    orisCode: number,
  ): Promise<MonitorLocation[]> {
    const plans: MonitorLocation[] = [];

    for (const loc of plan.locations) {
      plans.push(await getMonLocId(loc, facilitId, orisCode));
    }

    return plans;
  }

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOne(locationId);

    if (!result) {
      this.logger.error(NotFoundException, this.errorMsg, true, {
        locationId,
      });
    }

    return this.map.one(result);
  }

  async getLocationEntity(locationId: string): Promise<MonitorLocation> {
    const result = await this.repository.findOne(locationId);
    if (!result) {
      this.logger.error(NotFoundException, this.errorMsg, true, {
        locationId,
      });
    }
    return result;
  }

  async getLocationRelationships(locId: string) {
    const location = await this.getLocationEntity(locId);
    const hasUnit = location.unit !== null;
    const id = location.unit
      ? location.unit.id.toString()
      : location.stackPipe.id;
    return this.uscServcie.getUnitStackRelationships(hasUnit, id);
  }

  async importMonitorLocation(
    plan: UpdateMonitorPlanDTO,
    facilityId: number,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const location of plan.locations) {
        promises.push(
          new Promise(async innerResolve => {
            const innerPromises = [];

            const unitRecord = await this.unitService.getUnitByNameAndFacId(
              location.unitId,
              facilityId,
            );

            // Get LocIds by unitId (unitName) or stackPipeId(stackPipeName)
            const monitorLocationRecord = await getMonLocId(
              location,
              facilityId,
              plan.orisCode,
            );

            innerPromises.push(
              this.componentService.importComponent(
                location,
                monitorLocationRecord.id,
                userId,
              ),
            );

            if (unitRecord) {
              innerPromises.push(
                this.unitService.importUnit(
                  unitRecord,
                  location.nonLoadBasedIndicator,
                ),
              );
            }

            innerPromises.push(
              this.unitCapacityService.importUnityCapacity(
                location,
                unitRecord.id,
                monitorLocationRecord.id,
                userId,
              ),
            );

            innerPromises.push(
              this.unitControlService.importUnitControl(
                location,
                unitRecord.id,
                monitorLocationRecord.id,
                userId,
              ),
            );

            innerPromises.push(
              this.unitFuelService.importUnitFuel(
                location,
                unitRecord.id,
                monitorLocationRecord.id,
                userId,
              ),
            );

            innerPromises.push(
              this.matsMethodService.importMatsMethod(
                monitorLocationRecord.id,
                location.matsMethods,
                userId,
              ),
            );

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
