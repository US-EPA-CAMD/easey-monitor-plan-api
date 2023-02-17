import { Get, Controller, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
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
  @RoleGuard(
    { queryParam: 'orisCodes', isPipeDelimitted: true },
    LookupType.Facility,
  )
  getConfigurations(
    @Query() dto: ConfigurationMultipleParamsDTO,
  ): Promise<MonitorPlanDTO[]> {
    return this.service.getConfigurations(dto.orisCodes, dto.monPlanIds);
  }
}
