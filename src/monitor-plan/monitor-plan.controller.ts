import {
  Get,
  Query,
  Controller,  
  ValidationPipe
} from '@nestjs/common';

import {
  ApiTags,  
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { MonitorPlanDTO } from 'src/dtos/monitor-plan.dto';
import { MonitorPlanParamsDTO } from '../dtos/monitor-plan-params.dto';
import { MonitorPlanService } from './monitor-plan.service';

@ApiTags()
@Controller()
export class MonitorPlanController {
  constructor(
    private service: MonitorPlanService
  ) {}

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
  getMonitorPlans(
    @Query(ValidationPipe) paramsDTO: MonitorPlanParamsDTO
  ): Promise<MonitorPlanDTO[]> {
    return this.service.getMonitorPlans(paramsDTO);
  }
}
