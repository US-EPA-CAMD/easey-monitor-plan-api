import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { UpdateMonitorLocationDTO } from 'src/dtos/monitor-location-update.dto';
import { UpdateMonitorPlanDTO } from 'src/dtos/monitor-plan-update.dto';
import { UnitService } from '../unit/unit.service';
import { getMonLocId } from 'src/import-checks/utilities/utils';
import { ComponentWorkspaceService } from 'src/component-workspace/component.service';
import { UnitCapacityWorkspaceService } from 'src/unit-capacity-workspace/unit-capacity.service';
import { UnitControlWorkspaceService } from 'src/unit-control-workspace/unit-control.service';
import { UnitFuelWorkspaceService } from 'src/unit-fuel-workspace/unit-fuel.service';

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
    private Logger: Logger,
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOne(locationId);

    if (!result) {
      this.Logger.error(NotFoundException, this.errorMsg, true, {
        locationId,
      });
    }

    return this.map.one(result);
  }

  async getLocationEntity(locationId: string): Promise<MonitorLocation> {
    const result = await this.repository.findOne(locationId);
    if (!result) {
      this.Logger.error(NotFoundException, this.errorMsg, true, {
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
    for (const location of plan.locations) {
      new Promise(async () => {
        const unitRecord = await this.unitService.getUnitByNameAndFacId(
          location.unitId,
          facilityId,
        );
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
        this.unitService.importUnit(unitRecord, location.nonLoadBasedIndicator);
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
      });
    }
  }
}
