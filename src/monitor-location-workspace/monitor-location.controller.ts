import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationWorkspaceService } from './monitor-location.service';

@ApiTags('Locations')
@Controller()
export class MonitorLocationWorkspaceController {
  constructor(readonly service: MonitorLocationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorLocationDTO,
    description:
      'Retrieves workspace location record from specific location ID',
  })
  getLocation(@Param('locId') locationId: string): Promise<MonitorLocationDTO> {
    return this.service.getLocation(locationId);
  }

  @Get('relationships')
  async getLocationRelationships(@Param('locId') locId: string) {
    return this.service.getLocationRelationships(locId);
  }
}
