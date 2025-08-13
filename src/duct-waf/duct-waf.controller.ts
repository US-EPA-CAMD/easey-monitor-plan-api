import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { DuctWafService } from './duct-waf.service';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rectangular Duct WAF')
@ApiExtraModels(DuctWafDTO)
export class DuctWafController {
  constructor(private readonly service: DuctWafService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official duct waf records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(DuctWafDTO) },
              },
            },
          },
        },
      }
  })
  async getDuctWafs(@Param('locId') locationId: string): Promise<ArrayResponse<DuctWafDTO>> {
    const ductWafs = await this.service.getDuctWafs(locationId);

    return  {
      items: ductWafs
    };
  }
}
