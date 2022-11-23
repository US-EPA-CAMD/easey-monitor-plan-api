import { Get, Controller, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Configurations')
export class MonitorConfigurationsWorkspaceController {
  constructor(private service: MonitorConfigurationsWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanDTO,
    description: 'Retrieves official Monitor Plan configurations',
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCodes',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: false,
    explode: false,
  })
  getConfigurations(
    @Query() dto: ConfigurationMultipleParamsDTO,
  ): Promise<MonitorPlanDTO[]> {
    return this.service.getConfigurations(dto.orisCodes, dto.monPlanIds);
  }
}
