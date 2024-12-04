import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';
import { AuditLog } from '@us-epa-camd/easey-common/decorators';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanService } from './monitor-span.service';

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
  @AuditLog({
    label: 'Retrieved monitor location spans',
    requestParamsOutFields: ['locId'],
  })
  getSpans(@Param('locId') locationId: string): Promise<MonitorSpanDTO[]> {
    return this.service.getSpans(locationId);
  }
}
