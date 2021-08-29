import { Get, Param, Controller, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanService } from './monitor-plan.service';

@ApiTags('Plans & Configurations')
@Controller()
export class MonitorPlanController {
  constructor(private service: MonitorPlanService) {}

  @Get('/:id')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves official Monitor Plan record',
  })
  getMonitorPlan(@Param('id') monPlanId: string): Promise<MonitorPlanDTO> {
    return this.service.getMonitorPlan(monPlanId);
  }

  @Get('/:orisCode/configurations')
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
