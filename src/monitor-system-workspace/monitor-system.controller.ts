import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body } from '@nestjs/common';

import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { UpdateMonitorSystemDTO } from 'src/dtos/monitor-system-update.dto';

@ApiTags('Systems')
@Controller()
export class MonitorSystemWorkspaceController {
  constructor(private service: MonitorSystemWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSystemDTO,
    description: 'Retrieves workspace system records for a monitor location',
  })
  getSystems(@Param('locId') locationId: string): Promise<MonitorSystemDTO[]> {
    return this.service.getSystems(locationId);
  }

  @Post()
  @ApiOkResponse({
    type: MonitorSystemDTO,
    description: 'Creates a workspace system record for a give location',
  })
  createSystem(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorSystemDTO,
  ): Promise<MonitorSystemDTO> {
    return this.service.createSystem(locationId, payload);
  }
}
