import { Get, Controller, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { LookupType, UserRole } from '@us-epa-camd/easey-common/enums';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Configurations')
@ApiExcludeControllerByEnv()
@ApiExtraModels(MonitorPlanDTO)
export class MonitorConfigurationsWorkspaceController {
  constructor(private service: MonitorConfigurationsWorkspaceService) {}

  @Get('all')
  @ApiOkResponse({
    description: 'Retrieves all the workspace Monitor Plan configurations',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorPlanDTO) },
              },
            },
          },
        },
      }
  })
  @RoleGuard({ requiredRoles: [UserRole.ADMIN] }, LookupType.MonitorPlan) 
  @AuditLog({
    label: 'Retrieved all the workspace configurations',
  })
  async getAllConfigurations(): Promise<ArrayResponse<MonitorPlanDTO>> {
    const configurations = await this.service.getAllConfigurations();

    return  {
      items: configurations
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Retrieves workspace Monitor Plan configurations',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorPlanDTO) },
              },
            },
          },
        },
      }
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
  @AuditLog({
    label: 'Retrieved workspace configurations',
    requestQueryOutFields: ['orisCodes', 'monPlanIds']
  })
  async getConfigurations(
    @Query() dto: ConfigurationMultipleParamsDTO,
    @User() user: CurrentUser,
  ): Promise<ArrayResponse<MonitorPlanDTO>> {
    if (!user.roles.includes(UserRole.ADMIN)) {
      const userAllowedOrisCodes = new Set(user.facilities.map(f => f.orisCode));
      let hasAllPermissions = dto.orisCodes.every(requestedCode => 
        userAllowedOrisCodes.has(requestedCode)
      );
      if (!hasAllPermissions) {
        throw new ForbiddenException('You do not have permission to access one or more of the requested facilities.');
      }
    }
    
    const monitorPlanDTOs = await this.service.getConfigurations(dto.orisCodes, dto.monPlanIds);

    return  {
      items: monitorPlanDTOs
    };
  }
}
