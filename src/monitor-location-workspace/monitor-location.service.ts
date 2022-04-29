import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { UpdateMonitorPlanDTO } from 'src/dtos/monitor-plan-update.dto';
import { getMonLocId } from 'src/import-checks/utilities/utils';
import { MatsMethodWorkspaceService } from 'src/mats-method-workspace/mats-method.service';

@Injectable()
export class MonitorLocationWorkspaceService {
  readonly errorMsg: 'Monitor Location Not Found';
  constructor(
    @InjectRepository(MonitorLocationWorkspaceRepository)
    readonly repository: MonitorLocationWorkspaceRepository,
    readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationWorkspaceService,
    private readonly matsMethodService: MatsMethodWorkspaceService,
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
    monPlanId: string,
    plan: UpdateMonitorPlanDTO,
    facilityId: number,
    userId: string,
  ) {
    for (const location of plan.locations) {
      new Promise(async () => {
        const monitorLocationRecord = await getMonLocId(
          location,
          facilityId,
          plan.orisCode,
        );

        // Monitor MATs method Merge Logic
        await this.matsMethodService.importMethod(
          monPlanId,
          location.matsMethods,
          userId,
        );
      });
    }
  }
}
