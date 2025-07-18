import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Systems')
@ApiExtraModels(MonitorSystemDTO)
export class MonitorSystemController {
  constructor(private service: MonitorSystemService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official system records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorSystemDTO) },
              },
            },
          },
        },
      }
  })
  async getSystems(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorSystemDTO>> {
    const systems = await this.service.getSystems(locationId);

    return  {
      items: systems
    }
  }
}
