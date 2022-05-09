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

@Injectable()
export class MonitorLocationWorkspaceService {
  readonly errorMsg: 'Monitor Location Not Found';
  constructor(
    @InjectRepository(MonitorLocationWorkspaceRepository)
    readonly repository: MonitorLocationWorkspaceRepository,
    readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationWorkspaceService,
    private readonly unitService: UnitService,
    private readonly componentService: ComponentWorkspaceService,
    private readonly unitCapacityService: UnitCapacityWorkspaceService,
    private readonly unitControlService: UnitControlWorkspaceService,
    private readonly unitFuelService: UnitFuelWorkspaceService,
    private readonly qualificationService: MonitorQualificationWorkspaceService,

    private readonly logger: Logger,
  ) {}

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
    const promises = [];

    for (const location of plan.locations) {
      promises.push(
        new Promise(async () => {
          const unitRecord = await this.unitService.getUnitByNameAndFacId(
            location.unitId,
            facilityId,
          );

          // TODO: Get LocIds by unitId (unitName) or stackPipeId(stackPipeName)
          const monitorLocationRecord = await getMonLocId(
            location,
            facilityId,
            plan.orisCode,
          );

          this.componentService.importComponent(
            location,
            monitorLocationRecord.id,
            userId,
          );
          this.unitService.importUnit(
            unitRecord,
            location.nonLoadBasedIndicator,
          );
          this.unitCapacityService.importUnityCapacity(
            location,
            unitRecord.id,
            monitorLocationRecord.id,
            userId,
          );
          this.unitControlService.importUnitControl(
            location,
            unitRecord.id,
            monitorLocationRecord.id,
            userId,
          );
          this.unitFuelService.importUnitFuel(
            location,
            unitRecord.id,
            monitorLocationRecord.id,
            userId,
          );
        }),
      );
    }

    return promises;
  }
}
