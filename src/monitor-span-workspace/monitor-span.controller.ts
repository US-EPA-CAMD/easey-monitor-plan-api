import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Post } from '@nestjs/common';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { UpdateMonitorSpanDTO } from '../dtos/monitor-span-update.dto';

@ApiTags('Spans')
@Controller()
export class MonitorSpanWorkspaceController {
  constructor(private service: MonitorSpanWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Retrieves workspace span records for a monitor location',
  })
  getSpans(@Param('locId') locationId: string): Promise<MonitorSpanDTO[]> {
    return this.service.getSpans(locationId);
  }

  @Post()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Creates a workspace span record for a monitor location',
  })
  createSpan(
    @Param('locId') locationId: string,
    payload: UpdateMonitorSpanDTO,
  ): Promise<MonitorSpanDTO> {
    return this.service.createSpan(locationId, payload);
  }
}