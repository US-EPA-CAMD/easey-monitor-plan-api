import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { Get, Put, Post, Body, Param, Controller } from '@nestjs/common';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodWorkspaceService } from './monitor-method.service';
import { UpdateMonitorMethodDTO } from 'src/dtos/update-monitor-method.dto';

@ApiTags('Monitor Methods')
@Controller()
export class MonitorMethodWorkspaceController {
  constructor(private service: MonitorMethodWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorMethodDTO,
    description: 'Retrieves workspace Monitor Method records',
  })
  getMethods(@Param('locId') locId: string): Promise<MonitorMethodDTO[]> {
    return this.service.getMethods(locId);
  }

  @Post()
  @ApiOkResponse({
    type: MonitorMethodDTO,
    description: 'Creates workspace Monitor Method record',
  })
  createMethod(
    @Param('locId') locId: string,
    @Body() payload: MonitorMethodDTO,
  ): Promise<UpdateMonitorMethodDTO> {
    return this.service.createMethod(locId, payload);
  }

  @Put(':methodId')
  @ApiOkResponse({
    type: UpdateMonitorMethodDTO,
    description: 'Updates workspace Monitor Method record',
  })
  updateMethod(
    @Param('locId') locId: string,
    @Param('methodId') methodId: string,
    @Body() payload: MonitorMethodDTO,
  ): Promise<UpdateMonitorMethodDTO> {
    return this.service.updateMethod(locId, methodId, payload);
  }
}
