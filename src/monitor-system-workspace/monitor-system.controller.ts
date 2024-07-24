import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorSystemWorkspaceService } from './monitor-system.service';
import {
  MonitorSystemDTO,
  UpdateMonitorSystemDTO,
} from '../dtos/monitor-system.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { MonitorSystemCheckService } from './monitor-system-checks.service';

@Controller()
@ApiTags('Systems')
@ApiSecurity('APIKey')
export class MonitorSystemWorkspaceController {
  constructor(
    private service: MonitorSystemWorkspaceService,
    private checkService: MonitorSystemCheckService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSystemDTO,
    description:
      'Retrieves workspace system records for a given monitor location',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getSystems(@Param('locId') locationId: string): Promise<MonitorSystemDTO[]> {
    return this.service.getSystems(locationId);
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
    return this.service.createSystem(locationId, payload, user.userId);
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
    await this.checkService.runChecks(locationId, payload, false, true);
    return this.service.updateSystem(
      monitoringSystemId,
      payload,
      locationId,
      user.userId,
    );
  }
}
