import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanService } from './monitor-span.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Spans')
@ApiExtraModels(MonitorSpanDTO)
export class MonitorSpanController {
  constructor(private service: MonitorSpanService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official span records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorSpanDTO) },
              },
            },
          },
        },
      }
  })
  async getSpans(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorSpanDTO>> {
    const spans = await this.service.getSpans(locationId);

    return  {
      items: spans
    }
  }
}
