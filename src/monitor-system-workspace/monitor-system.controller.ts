import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
<<<<<<< HEAD
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';

import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { UpdateMonitorSystemDTO } from 'src/dtos/monitor-system-update.dto';
=======
import { Get, Param, Controller, Put, Body } from '@nestjs/common';

import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { UpdateMonitorSystemDTO } from '../dtos/monitor-system-update.dto';
>>>>>>> 10068d34b639daf41bf45f928864423198e60ca8

@ApiTags('Systems')
@Controller()
export class MonitorSystemWorkspaceController {
  constructor(private service: MonitorSystemWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSystemDTO,
    description:
      'Retrieves workspace system records for a given monitor location',
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
  
  @Put(':sysId')
  @ApiOkResponse({
    type: MonitorSystemDTO,
    description:
      'Updates workspace monitor system record for a given monitor location',
  })
  updateSystem(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemId: string,
    @Body() payload: UpdateMonitorSystemDTO,
  ): Promise<MonitorSystemDTO> {
    return this.service.updateSystem(monitoringSystemId, payload);
  }
}
