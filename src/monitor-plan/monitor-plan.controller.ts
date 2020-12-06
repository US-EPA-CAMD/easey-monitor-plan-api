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
  ParseIntPipe,
} from '@nestjs/common';

import { MonitorPlanService } from './monitor-plan.service';

@ApiTags('Monitor Plan')
@Controller('monitor-plans')
export class MonitorPlanController {
  constructor(private monitorPlanService: MonitorPlanService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieved all Monitor Plans',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getMonitorPlans(): string {
    // TODO: will need a query param (state, limit, offset) and DTO
    return this.monitorPlanService.getMonitorPlans();
  }
}
