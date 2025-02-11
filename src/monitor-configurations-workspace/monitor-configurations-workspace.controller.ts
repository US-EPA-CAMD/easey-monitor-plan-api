import { Get, Controller, Query } from '@nestjs/common';
import { AuditLog, RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Configurations')
@ApiExcludeControllerByEnv()
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
    {
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  @AuditLog({
    label: 'Retrieved workspace configurations',
    requestQueryOutFields: ['orisCodes', 'monPlanIds']
  })
  async getConfigurations(
    @Query() dto: ConfigurationMultipleParamsDTO,
  ): Promise<ArrayResponse<MonitorPlanDTO>> {
    const monitorPlanDTOs = await this.service.getConfigurations(dto.orisCodes, dto.monPlanIds);

    return  {
      items: monitorPlanDTOs
    };
  }
}
