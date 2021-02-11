import {
  Get,
  Param,
  Controller,  
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,  
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanService } from './monitor-plan.service';

@ApiTags('Monitor Plan')
@Controller()
export class MonitorPlanController {
  constructor(
    private service: MonitorPlanService
  ) {}
  @Get('/:orisCode/configurations')
  @ApiOkResponse({
    description: 'Retrieved Monitor Plans',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getConfigurations(@Param('orisCode', ParseIntPipe) orisCode: number): Promise<MonitorPlanDTO[]> {
    return this.service.getConfigurations(orisCode);
  }
}
