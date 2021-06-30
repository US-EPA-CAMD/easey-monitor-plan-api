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
    @Body() payload: UpdateMonitorMethodDTO,
  ): Promise<MonitorMethodDTO> {
    return this.service.createMethod(locId, payload);
  }

  @Put(':methodId')
  @ApiOkResponse({
    type: MonitorMethodDTO,
    description: 'Updates workspace Monitor Method record',
  })
  async updateMethod(
    @Param('locId') locId: string,
    @Param('methodId') methodId: string,
    @Body() payload: UpdateMonitorMethodDTO,
  ): Promise<MonitorMethodDTO> {
    const result = await this.service.updateMethod(methodId, payload);
    return result;
  }
}
