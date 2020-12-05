import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MonitorPlanParamsDTO } from './dto/monitor-plan-params.dto';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanDTO } from './dto/monitor-plan.dto';

@ApiTags('Monitor Plan')
@Controller()
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
  ): MonitorPlanDTO[] {
    /* const { facId, orisCode, page, perPage, orderBy } = monitorPlanParamsDTO;
      console.log(
        `facId=${facId}, orisCode=${orisCode}, page=${page}, perPage=${perPage}, orderBy=${orderBy}`,
      );*/
    return this.monitorPlanService.getMonitorPlan(monitorPlanParamsDTO);
  }
}
