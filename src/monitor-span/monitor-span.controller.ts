import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {
  Get,
  Param,
  Controller,
} from '@nestjs/common';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanService } from './monitor-span.service';

@ApiTags('Monitor Spans')
@Controller()
export class MonitorSpanController {
  constructor(
    private service: MonitorSpanService,
  ) {}

  @Get('/monitor-locations/:id/spans')
  @ApiOkResponse({
    description: 'Retrieved Methods',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getUnits(@Param('id') monLocId: string): Promise<MonitorSpanDTO[]> {
    return this.service.getMonitorSpans(monLocId);
  }
}
