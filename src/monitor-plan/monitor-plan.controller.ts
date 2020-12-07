import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {
  Req,
  Get,
  Controller,
} from '@nestjs/common';

import { Request } from 'express';

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
  getMonitorPlans(@Req() req: Request) {
    req.res.setHeader('Link', '</monitor-plans?page=1&per-page=25>; rel="previous",'+
      '</monitor-plans?page=3&per-page=25>; rel="next",'+
      '</monitor-plans?page=10&per-page=25>; rel="last"'
    );
    req.res.setHeader('X-Total-Count', 245);
    return this.monitorPlanService.getMonitorPlans();
  }
}
