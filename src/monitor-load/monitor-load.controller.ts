import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadService } from './monitor-load.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Loads')
@ApiExtraModels(MonitorLoadDTO)
export class MonitorLoadController {
  constructor(private service: MonitorLoadService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official load records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorLoadDTO) },
              },
            },
          },
        },
      }
  })
  async getLoads(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorLoadDTO>> {
    const loads = await this.service.getLoads(locationId);

    return  {
      items: loads
    }
  }
}
