import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body } from '@nestjs/common';

import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';
import { UpdateMonitorDefaultDTO } from '../dtos/monitor-default-update.dto';

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
}
