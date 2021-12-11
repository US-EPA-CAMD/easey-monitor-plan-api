import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationWorkspaceService } from './monitor-location.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Locations')
export class MonitorLocationWorkspaceController {
  constructor(readonly service: MonitorLocationWorkspaceService) {}

  @Get(':locId')
  @ApiOkResponse({
    isArray: true,
    type: MonitorLocationDTO,
    description:
      'Retrieves workspace location record from specific location ID',
  })
  getLocation(@Param('locId') locationId: string): Promise<MonitorLocationDTO> {
    return this.service.getLocation(locationId);
  }

  @Get(':locId/relationships')
  async getLocationRelationships(@Param('locId') locId: string) {
    return this.service.getLocationRelationships(locId);
  }
}
