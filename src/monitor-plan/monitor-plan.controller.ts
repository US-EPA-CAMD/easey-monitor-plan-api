import { Get, Param, Controller, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanService } from './monitor-plan.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Plans & Configurations')
export class MonitorPlanController {
  constructor(private service: MonitorPlanService) {}

  @Get(':planId')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves official Monitor Plan record',
  })
  getMonitorPlan(@Param('planId') planId: string): Promise<MonitorPlanDTO> {
    return this.service.getMonitorPlan(planId);
  }

  @Get(':orisCode/configurations')
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanDTO,
    description: 'Retrieves official Monitor Plan configurations',
  })
  getConfigurations(
    @Param('orisCode', ParseIntPipe) orisCode: number,
  ): Promise<MonitorPlanDTO[]> {
    return this.service.getConfigurations(orisCode);
  }
}
