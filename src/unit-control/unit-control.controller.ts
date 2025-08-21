import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { UnitControlDTO } from '../dtos/unit-control.dto';

import { UnitControlService } from './unit-control.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Controls')
@ApiExtraModels(UnitControlDTO)
export class UnitControlController {
  constructor(private readonly service: UnitControlService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace unit control records from a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitControlDTO) },
              },
            },
          },
        },
      }
  })
  async getUnitControls(
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitControlDTO>> {
    const unitCapacityDTOS = await this.service.getUnitControls(unitId);

    return {
      items: unitCapacityDTOS,
    };
  }
}
