import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { SystemFuelFlowService } from './system-fuel-flow.service';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Fuel Flows')
export class SystemFuelFlowController {
  constructor(private service: SystemFuelFlowService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: SystemFuelFlowDTO,
    description: 'Retrieves official fuel flow records for a monitor system',
  })
  getFuelFlows(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemFuelFlowDTO[]> {
    return this.service.getFuelFlows(monSysId);
  }
}
