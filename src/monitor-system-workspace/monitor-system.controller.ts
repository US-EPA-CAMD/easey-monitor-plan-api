import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorSystemWorkspaceService } from './monitor-system.service';
import {
  MonitorSystemDTO,
  UpdateMonitorSystemDTO,
} from '../dtos/monitor-system.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { MonitorSystemCheckService } from './monitor-system-checks.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiTags('Systems')
@ApiSecurity('APIKey')
@ApiExcludeControllerByEnv()
@ApiExtraModels(MonitorSystemDTO)
export class MonitorSystemWorkspaceController {
  constructor(
    private service: MonitorSystemWorkspaceService,
    private checkService: MonitorSystemCheckService,
  ) { }

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace system records for a given monitor location',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(MonitorSystemDTO) },
            },
          },
        },
      },
    }
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor location systems',
    requestParamsOutFields: ['locId'],
  })
  async getSystems(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorSystemDTO>> {
    const systems = await this.service.getSystems(locationId);

    return {
      items: systems
    }
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Created workspace monitor location system record',
    requestParamsOutFields: ['locId'],
    responseBodyOutFields: '*'
  })
  @ApiOkResponse({
    type: MonitorSystemDTO,
    description: 'Creates a workspace system record for a give location',
  })
  async createSystem(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorSystemDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorSystemDTO> {
    await this.checkService.runChecks(locationId, payload);
    return this.service.createSystem({
      locationId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':sysId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location system record',
    requestParamsOutFields: ['locId', 'sysId'],
    responseBodyOutFields: '*'
  })
  @ApiOkResponse({
    type: MonitorSystemDTO,
    description:
      'Updates workspace monitor system record for a given monitor location',
  })
  async updateSystem(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemId: string,
    @Body() payload: UpdateMonitorSystemDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorSystemDTO> {
    await this.checkService.runChecks(locationId, payload, false, true, null, monitoringSystemId);
    return this.service.updateSystem({
      monitoringSystemRecordId: monitoringSystemId,
      payload,
      locationId,
      userId: user.userId,
    });
  }
}
