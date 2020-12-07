import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {
  Req,
  Get,
  Query,
  Controller,
  ValidationPipe,
} from '@nestjs/common';

import { Request } from 'express';

import { MonitorPlanParamsDTO } from './dto/monitor-plan-params.dto';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanDTO } from './dto/monitor-plan.dto';

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
  getMonitorPlans(
    @Req() req: Request,
    @Query(ValidationPipe) monitorPlanParamsDTO: MonitorPlanParamsDTO,
  ): MonitorPlanDTO[] {
    req.res.setHeader('Link', '</monitor-plans?page=1&per-page=25>; rel="previous",'+
      '</monitor-plans?page=3&per-page=25>; rel="next",'+
      '</monitor-plans?page=10&per-page=25>; rel="last"'
    );
    req.res.setHeader('X-Total-Count', 245);
    /* const { facId, orisCode, page, perPage, orderBy } = monitorPlanParamsDTO;
      console.log(
        `facId=${facId}, orisCode=${orisCode}, page=${page}, perPage=${perPage}, orderBy=${orderBy}`,
      );*/
    return this.monitorPlanService.getMonitorPlan(monitorPlanParamsDTO);
  }
}
