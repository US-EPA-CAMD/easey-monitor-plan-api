import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeService } from './monitor-attribute.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Attributes')
@ApiExtraModels(MonitorAttributeDTO)
export class MonitorAttributeController {
  constructor(private readonly service: MonitorAttributeService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official attribute records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorAttributeDTO) },
              },
            },
          },
        },
      }
  })
  async getAttributes(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorAttributeDTO>> {
    const attributes = await this.service.getAttributes(locationId);

    return  {
      items: attributes
    };
  }
}
