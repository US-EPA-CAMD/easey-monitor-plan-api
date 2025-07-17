import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { UnitDTO } from '../dtos/unit.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Units')
@ApiExtraModels(UnitDTO)
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get(':id')
  @ApiOkResponse({
    description: 'Retrieves unit records from a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitDTO) },
              },
            },
          },
        },
      }
  })
  async getUnits(@Param('id') id: number): Promise<ArrayResponse<UnitDTO>> {
    const units = await this.service.getUnits(id);

    return  {
      items: units
    };
  }
}
