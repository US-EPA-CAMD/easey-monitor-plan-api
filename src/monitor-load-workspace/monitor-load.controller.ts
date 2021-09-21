import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { UpdateMonitorLoadDTO } from '../dtos/monitor-load-update.dto';

@ApiTags('Loads')
@Controller()
export class MonitorLoadWorkspaceController {
  constructor(private service: MonitorLoadWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Retrieves official load records for a monitor location',
  })
  getLoads(@Param('locId') locationId: string): Promise<MonitorLoadDTO[]> {
    return this.service.getLoads(locationId);
  }

  @Put(':loadId')
  @ApiOkResponse({
    type: MonitorLoadDTO,
    description: 'Updates a workspace load record for a monitor location',
  })
  async updateLoad(
    @Param('locId') locationId: string,
    @Param('loadId') spanId: string,
    @Body() payload: UpdateMonitorLoadDTO,
  ): Promise<MonitorLoadDTO> {
    return this.service.updateLoad(locationId, spanId, payload);
  }

  @Post()
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Creates a workspace load record for a monitor location',
  })
  createLoad(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorLoadDTO,
  ): Promise<MonitorLoadDTO> {
    return this.service.createLoad(locationId, payload);
  }
}
