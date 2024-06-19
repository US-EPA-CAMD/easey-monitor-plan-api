import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  SystemFuelFlowBaseDTO,
  SystemFuelFlowDTO,
} from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Fuel Flows')
export class SystemFuelFlowWorkspaceController {
  constructor(private readonly service: SystemFuelFlowWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: SystemFuelFlowDTO,
    description: 'Retrieves workspace fuel flow records for a monitor system',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getFuelFlows(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemFuelFlowDTO[]> {
    return this.service.getFuelFlows(monSysId);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
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
