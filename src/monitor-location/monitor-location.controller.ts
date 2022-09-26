import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationService } from './monitor-location.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Locations')
export class MonitorLocationController {
  constructor(readonly service: MonitorLocationService) {}

  @Get(':locId')
  @ApiOkResponse({
    isArray: true,
    type: MonitorLocationDTO,
    description:
      'Retrieves official location record from a specific location ID',
  })
  getLocation(@Param('locId') locationId: string): Promise<MonitorLocationDTO> {
    return this.service.getLocation(locationId);
  }

  @Get(':locId/relationships')
  @ApiOkResponse({
    isArray: true,
    type: MonitorLocationDTO,
    description:
      'Retrieves official relationships record for a specific location ID',
  })
  async getLocationRelationships(@Param('locId') locId: string) {
    return this.service.getLocationRelationships(locId);
  }
}
