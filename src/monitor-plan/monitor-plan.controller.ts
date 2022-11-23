import { Get, Param, Controller, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanService } from './monitor-plan.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Plans')
export class MonitorPlanController {
  constructor(private service: MonitorPlanService) {}

  @Get('export')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves official Monitor Plan record',
  })
  exportMonitorPlan(@Query('planId') planId: string): Promise<MonitorPlanDTO> {
    return this.service.exportMonitorPlan(planId);
  }

  @Get(':planId')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves information needed to refresh a monitor plan',
  })
  getMonitorPlan(@Param('planId') planId: string): Promise<MonitorPlanDTO> {
    return this.service.getTopLevelMonitorPlan(planId);
  }
}
