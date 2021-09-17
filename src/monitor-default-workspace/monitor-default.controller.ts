import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';

import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { UpdateMonitorDefaultDTO } from '../dtos/monitor-default-update.dto';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';

@ApiTags('Defaults')
@Controller()
export class MonitorDefaultWorkspaceController {
  constructor(private readonly service: MonitorDefaultWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorDefaultDTO,
    description: 'Retrieves workspace default records for a monitor location',
  })
  getDefaults(
    @Param('locId') locationId: string,
  ): Promise<MonitorDefaultDTO[]> {
    return this.service.getDefaults(locationId);
  }

  @Put(':defaultId')
  @ApiOkResponse({
    type: MonitorDefaultDTO,
    description: 'Updates a workspace default record for a monitor location',
  })
  async updateDefault(
    @Param('locId') locationId: string,
    @Param('defaultId') defaultId: string,
    @Body() payload: UpdateMonitorDefaultDTO,
  ): Promise<MonitorDefaultDTO> {
    return this.service.updateDefault(locationId, defaultId, payload);
  }

  @Post()
  @ApiOkResponse({
    isArray: true,
    type: MonitorDefaultDTO,
    description: 'Creates a workspace defaults record for a monitor location',
  })
  createDefault(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorDefaultDTO,
  ): Promise<MonitorDefaultDTO> {
    return this.service.createDefault(locationId, payload);
  }
}
