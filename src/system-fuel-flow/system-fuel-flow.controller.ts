import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { SystemFuelFlowService } from './system-fuel-flow.service';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseSystemFuelFlowDTO = createArrayResponseDto(SystemFuelFlowDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Fuel Flows')
export class SystemFuelFlowController {
  constructor(private service: SystemFuelFlowService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseSystemFuelFlowDTO,
    description: 'Retrieves official fuel flow records for a monitor system',
  })
  async getFuelFlows(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<ArrayResponse<SystemFuelFlowDTO>> {
    const fuelFlows = await this.service.getFuelFlows(monSysId);

    return  {
      items: fuelFlows
    }
  }
}
