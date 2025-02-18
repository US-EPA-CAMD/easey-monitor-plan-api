import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanService } from './monitor-span.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Spans')
export class MonitorSpanController {
  constructor(private service: MonitorSpanService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Retrieves official span records for a monitor location',
  })
  async getSpans(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorSpanDTO>> {
    const spans = await this.service.getSpans(locationId);

    return  {
      items: spans
    }
  }
}
