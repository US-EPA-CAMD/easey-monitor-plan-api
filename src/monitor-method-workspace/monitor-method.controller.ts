import { ApiTags, ApiOkResponse, ApiSecurity, ApiExcludeController } from '@nestjs/swagger';
import { Get, Put, Post, Body, Param, Controller } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import {
  MonitorMethodBaseDTO,
  MonitorMethodDTO,
} from '../dtos/monitor-method.dto';
import { MonitorMethodWorkspaceService } from './monitor-method.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Methods')
@ApiExcludeController()
export class MonitorMethodWorkspaceController {
  constructor(private service: MonitorMethodWorkspaceService) {}

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
    label: 'Retrieved workspace monitor location methods',
    requestParamsOutFields: ['locId']
  })
  @ApiOkResponse({
    isArray: true,
    type: MonitorMethodDTO,
    description: 'Retrieves workspace Monitor Method records',
  })
  getMethods(@Param('locId') locId: string): Promise<MonitorMethodDTO[]> {
    return this.service.getMethods(locId);
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
    label: 'Created workspace monitor location method record',
    requestParamsOutFields: ['locId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorMethodDTO,
    description: 'Creates workspace Monitor Method record',
  })
  createMethod(
    @Param('locId') locId: string,
    @Body() payload: MonitorMethodBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorMethodDTO> {
    return this.service.createMethod({
      locationId: locId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':methodId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location method record',
    requestParamsOutFields: ['locId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorMethodDTO,
    description: 'Updates workspace Monitor Method record',
  })
  updateMethod(
    @Param('locId') locId: string,
    @Param('methodId') methodId: string,
    @Body() payload: MonitorMethodBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorMethodDTO> {
    return this.service.updateMethod({
      methodId,
      payload,
      locationId: locId,
      userId: user.userId,
    });
  }
}
