import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';

import { UnitFuelService } from './unit-fuel.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Fuels')
@ApiExtraModels(UnitFuelDTO)
export class UnitFuelController {
  constructor(private readonly service: UnitFuelService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official unit fuel records from a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitFuelDTO) },
              },
            },
          },
        },
      }
  })
  async getUnitFuels(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitFuelDTO>> {
    const unitFuels = await this.service.getUnitFuels(locId, unitId);

    return  {
      items: unitFuels
    }
  }
}
