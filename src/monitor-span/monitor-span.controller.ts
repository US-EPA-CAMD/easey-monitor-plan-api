import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanService } from './monitor-span.service';

@ApiTags('Spans')
@Controller()
export class MonitorSpanController {
  constructor(private service: MonitorSpanService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Retrieves official span records for a monitor location',
  })
  getSpans(@Param('locId') monLocId: string): Promise<MonitorSpanDTO[]> {
    return this.service.getSpans(monLocId);
  }
}
