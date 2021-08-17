import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body } from '@nestjs/common';

import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { UpdateSystemFuelFlowDTO } from 'src/dtos/update-system-fuel-flow.dto';

@ApiTags('System Fuel Flows')
@Controller()
export class SystemFuelFlowWorkspaceController {
  constructor(private readonly service: SystemFuelFlowWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: SystemFuelFlowDTO,
    description: 'Retrieves official fuel flow records for a monitor system',
  })
  getFuelFlows(
    @Param('locId') monLocId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemFuelFlowDTO[]> {
    return this.service.getFuelFlows(monSysId);
  }

  @Put(':fuelFlowId')
  @ApiOkResponse({
    type: SystemFuelFlowDTO,
    description: 'Updates Workspace System Fuel Flow record',
  })
  updateSystemFlow(
    @Param('locId') locId: string,
    @Param('systemId') systemId: string,
    @Param('fuelFlowId') id: string,
    @Body() payload: UpdateSystemFuelFlowDTO,
  ): Promise<SystemFuelFlowDTO> {
    return this.service.updateFuelFlow(id, payload);
  }
}
