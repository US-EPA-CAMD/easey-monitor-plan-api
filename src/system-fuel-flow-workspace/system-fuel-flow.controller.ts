import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';

@ApiTags('System Fuel Flows')
@Controller()
export class SystemFuelFlowWorkspaceController {
  constructor(private service: SystemFuelFlowWorkspaceService) {}

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
}
