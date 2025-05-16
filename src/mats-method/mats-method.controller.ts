import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodService } from './mats-method.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Methods')
@ApiExtraModels(MatsMethodDTO)
export class MatsMethodController {
  constructor(private readonly service: MatsMethodService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official MATS Method records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MatsMethodDTO) },
              },
            },
          },
        },
      }
  })
  async getMethods(@Param('locId') locationId: string): Promise<ArrayResponse<MatsMethodDTO>> {
    const methods = await this.service.getMethods(locationId);

    return  {
      items: methods
    };
  }
}
