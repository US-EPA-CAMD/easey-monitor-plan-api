import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodService } from './monitor-method.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Methods')
@ApiExtraModels(MonitorMethodDTO)
export class MonitorMethodController {
  constructor(private service: MonitorMethodService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official method records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorMethodDTO) },
              },
            },
          },
        },
      }
  })
  async getMethods(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorMethodDTO>> {
    const methods = await this.service.getMethods(locationId);

    return  {
      items: methods
    }
  }
}
