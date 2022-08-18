import { Get, Param, Controller, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanService } from './monitor-plan.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Plans & Configurations')
export class MonitorPlanController {
  constructor(private service: MonitorPlanService) {}

  @Get('export')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves official Monitor Plan record',
  })
  getMonitorPlan(@Query('planId') planId: string): Promise<MonitorPlanDTO> {
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

  @Get('configurations/last-updated')
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanDTO,
    description:
      'Retrieves workspace Monitor Plan configurations that have been updated after a certain date',
  })
  getLastUpdated(
    @Query('date') queryTime: Date,
  ): Promise<LastUpdatedConfigDTO> {
    return this.service.getConfigurationsByLastUpdated(queryTime);
  }
}
