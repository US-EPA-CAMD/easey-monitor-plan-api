import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  MonitorDefaultBaseDTO,
  MonitorDefaultDTO,
} from '../dtos/monitor-default.dto';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Defaults')
@ApiExcludeControllerByEnv()
@ApiExtraModels(MonitorDefaultDTO)
export class MonitorDefaultWorkspaceController {
  constructor(private readonly service: MonitorDefaultWorkspaceService) {}

  @Get()
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor location default records',
    requestParamsOutFields:['locId'],
  })
  @ApiOkResponse({
    description: 'Retrieves workspace default records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorDefaultDTO) },
              },
            },
          },
        },
      }
  })
  async getDefaults(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorDefaultDTO>> {
    const defaults = await this.service.getDefaults(locationId);

    return  {
      items: defaults
    };
  }

  @Put(':defaultId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location default record',
    requestParamsOutFields:['locId', 'defaultId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorDefaultDTO,
    description: 'Updates a workspace default record for a monitor location',
  })
  async updateDefault(
    @Param('locId') locationId: string,
    @Param('defaultId') defaultId: string,
    @Body() payload: MonitorDefaultBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorDefaultDTO> {
    return this.service.updateDefault({
      locationId,
      defaultId,
      payload,
      userId: user.userId,
    });
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
    label: 'Created workspace monitor location default record',
    requestParamsOutFields:['locId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorDefaultDTO,
    description: 'Creates a workspace defaults record for a monitor location',
  })
  createDefault(
    @Param('locId') locationId: string,
    @Body() payload: MonitorDefaultBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorDefaultDTO> {
    return this.service.createDefault({
      locationId,
      payload,
      userId: user.userId,
    });
  }
}
