import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';

import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { UpdateSystemFuelFlowDTO } from '../dtos/system-fuel-flow-update.dto';

@ApiTags('System Fuel Flows')
@Controller()
export class SystemFuelFlowWorkspaceController {
  constructor(private readonly service: SystemFuelFlowWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: SystemFuelFlowDTO,
    description: 'Retrieves workspace fuel flow records for a monitor system',
  })
  getFuelFlows(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemFuelFlowDTO[]> {
    return this.service.getFuelFlows(monSysId);
  }

  @Post()
  @ApiOkResponse({
    type: SystemFuelFlowDTO,
    description: 'Creates official fuel flow records for a monitor system',
  })
  async createFuelFlow(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemRecordId: string,
    @Body() payload: UpdateSystemFuelFlowDTO,
  ): Promise<SystemFuelFlowDTO> {
    return this.service.createFuelFlow(monitoringSystemRecordId, payload);
  }

  @Put(':fuelFlowId')
  @ApiOkResponse({
    type: SystemFuelFlowDTO,
    description:
      'Updates workspace system fuel flow record for a monitor system',
  })
  updateSystemFlow(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemRecordId: string,
    @Param('fuelFlowId') id: string,
    @Body() payload: UpdateSystemFuelFlowDTO,
  ): Promise<SystemFuelFlowDTO> {
    return this.service.updateFuelFlow(id, payload);
  }
}
