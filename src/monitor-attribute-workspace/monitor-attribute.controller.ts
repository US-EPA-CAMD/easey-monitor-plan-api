import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';
import {AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  MonitorAttributeBaseDTO,
  MonitorAttributeDTO,
} from '../dtos/monitor-attribute.dto';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Attributes')
@ApiExcludeControllerByEnv()
export class MonitorAttributeWorkspaceController {
  constructor(private readonly service: MonitorAttributeWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorAttributeDTO,
    description: 'Retrieves workspace attribute records for a monitor location',
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
    label: 'Retrieved workspace monitor location attribute records',
    requestParamsOutFields:['locId']
  })
  async getAttributes(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorAttributeDTO>> {
    const attributeDTOS = await this.service.getAttributes(locationId);

    return  {
      items: attributeDTOS
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
    label: 'Created workspace monitor location attribute record',
    requestParamsOutFields:['locId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorAttributeDTO,
    description: 'Creates a workspace monitor location attribute record',
  })
  createAttribute(
    @Param('locId') locationId: string,
    @Body() payload: MonitorAttributeBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorAttributeDTO> {
    return this.service.createAttribute({
      locationId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':attributeId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location attribute record',
    requestParamsOutFields:['locId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorAttributeDTO,
    description: 'Updates a workspace monitor location attribute record',
  })
  updateAttribute(
    @Param('locId') locationId: string,
    @Param('attributeId') id: string,
    @Body() payload: MonitorAttributeBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorAttributeDTO> {
    return this.service.updateAttribute({
      locationId,
      id,
      payload,
      userId: user.userId,
    });
  }
}
