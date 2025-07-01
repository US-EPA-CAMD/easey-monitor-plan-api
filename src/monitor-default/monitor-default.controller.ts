import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultService } from './monitor-default.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Defaults')
@ApiExtraModels(MonitorDefaultDTO)
export class MonitorDefaultController {
  constructor(private readonly service: MonitorDefaultService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official default records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorDefaultDTO) },
              },
            },
          },
        },
      }
  })
  async getDefaults(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorDefaultDTO>> {
    const defaults = await this.service.getDefaults(locationId);

    return  {
      items: defaults
    };
  }
}
