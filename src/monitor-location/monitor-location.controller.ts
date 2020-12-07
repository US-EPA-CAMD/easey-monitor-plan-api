import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {
  Get,
  Param,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

import { MonitorLocationService } from './monitor-location.service';

@ApiTags('Monitor Location')
@Controller('monitor-locations')
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