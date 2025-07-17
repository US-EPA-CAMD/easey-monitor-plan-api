import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityService } from './unit-capacity.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Capacities')
@ApiExtraModels(UnitCapacityDTO)
export class UnitCapacityController {
  constructor(private readonly service: UnitCapacityService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace unit capacity records from a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitCapacityDTO) },
              },
            },
          },
        },
      }
  })
  async getUnitCapacities(
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitCapacityDTO>> {
    const unitCapacityDTOS = await this.service.getUnitCapacities(unitId);

    return  {
      items: unitCapacityDTOS
    }
  }
}
