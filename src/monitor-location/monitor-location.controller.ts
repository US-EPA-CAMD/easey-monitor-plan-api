import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Get, Controller } from '@nestjs/common';

import { MonitorLocationService } from './monitor-location.service';

@ApiTags('Monitor Location')
@Controller()
export class MonitorLocationController {
  constructor(private monitorLocationService: MonitorLocationService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieved all Monitor Locations',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getMonitorLocations(): string {
    // TODO: will need a query param (state, limit, offset) and DTO
    return this.monitorLocationService.getMonitorLocations();
  }
}
