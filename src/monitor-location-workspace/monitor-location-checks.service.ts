import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

@Injectable()
export class MonitorLocationChecksService {
  constructor(
    private readonly logger: Logger,
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

    locations.forEach(location => {
      if (location.stackPipeId) {
        const match = location.stackPipeId.match(/^[MC][SP][a-zA-Z0-9-]+$/);
        if (!match || (match[0].length < 4 && match[0].includes('-'))) {
          errorList.push(
            `[MONLOC-19-B] You reported a Stack/Pipe ID '${location.stackPipeId}' which has an invalid format.`,
          );
        }
      }
    });

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
