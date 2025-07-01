import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  SystemFuelFlowBaseDTO,
  SystemFuelFlowDTO,
} from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Fuel Flows')
@ApiExcludeControllerByEnv()
@ApiExtraModels(SystemFuelFlowDTO)
export class SystemFuelFlowWorkspaceController {
  constructor(private readonly service: SystemFuelFlowWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves workspace fuel flow records for a monitor system',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(SystemFuelFlowDTO) },
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
    label: 'Retrieved workspace monitor location system fuel flow records',
    requestParamsOutFields: ['locId', 'sysId']
  })
  async getFuelFlows(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<ArrayResponse<SystemFuelFlowDTO>> {
    const fuelFlows = await this.service.getFuelFlows(monSysId);

    return  {
      items: fuelFlows
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
    label: 'Created workspace monitor location system fuel flow record',
    requestParamsOutFields: ['locId', 'sysId'],
    responseBodyOutFields: '*'
  })
  @ApiOkResponse({
    type: SystemFuelFlowDTO,
    description: 'Creates official fuel flow records for a monitor system',
  })
  async createFuelFlow(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemRecordId: string,
    @Body() payload: SystemFuelFlowBaseDTO,
    @User() user: CurrentUser,
  ): Promise<SystemFuelFlowDTO> {
    return this.service.createFuelFlow({
      monitoringSystemRecordId,
      payload,
      locationId,
      userId: user.userId,
    });
  }

  @Put(':fuelFlowId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location system fuel flow record',
    requestParamsOutFields: ['locId', 'sysId', 'fuelFlowId'],
    responseBodyOutFields: '*'
  })
  @ApiOkResponse({
    type: SystemFuelFlowDTO,
    description:
      'Updates workspace system fuel flow record for a monitor system',
  })
  updateSystemFlow(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemRecordId: string,
    @Param('fuelFlowId') id: string,
    @Body() payload: SystemFuelFlowBaseDTO,
    @User() user: CurrentUser,
  ): Promise<SystemFuelFlowDTO> {
    return this.service.updateFuelFlow({
      fuelFlowId: id,
      payload,
      locationId,
      userId: user.userId,
    });
  }
}
