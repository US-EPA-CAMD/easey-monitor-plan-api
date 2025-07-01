import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaService } from './monitor-formula.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Formulas')
@ApiExtraModels(MonitorFormulaDTO)
export class MonitorFormulaController {
  constructor(private service: MonitorFormulaService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official formula records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorFormulaDTO) },
              },
            },
          },
        },
      }
  })
  async getFormulas(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorFormulaDTO>> {
    const formulas = await this.service.getFormulas(locationId);

    return  {
      items: formulas
    };
  }
}
