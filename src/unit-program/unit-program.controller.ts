import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { UnitProgramService } from './unit-program.service';
import { UnitProgramDTO } from '../dtos/unit-program.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Programs')
@ApiExtraModels(UnitProgramDTO)
export class UnitProgramController {
  constructor(private readonly service: UnitProgramService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves unit control records from a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitProgramDTO) },
              },
            },
          },
        },
      }
  })
  async getUnitProgramsByUnitRecordId(
    @Param('unitId') unitRecordId: number,
  ): Promise<ArrayResponse<UnitProgramDTO>> {
    const unitProgramDTOS = await this.service.getUnitProgramsByUnitRecordId(unitRecordId);

    return  {
      items: unitProgramDTOS
    }
  }
}
