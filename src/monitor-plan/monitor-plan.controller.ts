import { Req, Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MonitorPlanParamsDTO } from 'src/dtos/monitor-plan-params.dto';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanDTO } from 'src/dtos/monitor-plan.dto';

import { Request } from 'express';

@ApiTags('Monitor Plan')
@Controller('monitor-plans')
export class MonitorPlanController {
  constructor(private monitorPlanService: MonitorPlanService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieved Monitor Plans',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getMonitorPlan(
    @Query(ValidationPipe) monitorPlanParamsDTO: MonitorPlanParamsDTO,
    @Req() req: Request,
  ): MonitorPlanDTO[] {
    /*const { facId, orisCode, page, perPage, orderBy } = monitorPlanParamsDTO;
    console.log(
      `facId=${facId}, orisCode=${orisCode}, page=${page}, perPage=${perPage}, orderBy=${orderBy}`,
    );*/
    return this.monitorPlanService.getMonitorPlan(monitorPlanParamsDTO, req);
  }
}
