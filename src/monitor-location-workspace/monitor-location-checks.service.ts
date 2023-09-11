import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';

@Injectable()
export class MonitorLocationChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly repository: MonitorLocationWorkspaceRepository,
  ) {}

  processLocations(payload: UpdateMonitorPlanDTO): LocationIdentifiers[] {
    const locations: LocationIdentifiers[] = [];

    const addLocation = (i: UpdateMonitorLocationDTO) => {
      locations.push({
        unitId: i.unitId,
        locationId: null,
        stackPipeId: i.stackPipeId,
      });
    };

    if (payload.monitoringLocationData) {
      payload.monitoringLocationData.forEach(i => addLocation(i));
    }

    return locations;
  }

  async runChecks(
    payload: UpdateMonitorPlanDTO,
  ): Promise<[LocationIdentifiers[], string[]]> {
    let errorList = [];
    const locations: LocationIdentifiers[] = this.processLocations(payload);

    if (locations.length > 0) {
      const dbLocations = await this.repository.getLocationsByUnitStackPipeIds(
        payload.orisCode,
        locations.filter(i => i.unitId !== null).map(i => i.unitId),
        locations.filter(i => i.stackPipeId !== null).map(i => i.stackPipeId),
      );

      locations.forEach(location => {
        const dbLocation = dbLocations.find(
          i =>
            i?.unit?.name === location?.unitId ||
            i?.stackPipe?.name === location?.stackPipeId,
        );
        location.locationId = dbLocation?.id;
      });
    }

    return [locations, errorList];
  }
}
