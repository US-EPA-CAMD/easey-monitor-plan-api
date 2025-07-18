import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { SystemFuelFlowService } from './system-fuel-flow.service';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Fuel Flows')
@ApiExtraModels(SystemFuelFlowDTO)
export class SystemFuelFlowController {
  constructor(private service: SystemFuelFlowService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official fuel flow records for a monitor system',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(SystemFuelFlowDTO) },
              },
            },
          },
        },
      }
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
