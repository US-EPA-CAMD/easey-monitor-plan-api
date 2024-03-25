import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadBaseDTO, MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Loads')
export class MonitorLoadWorkspaceController {
  constructor(private readonly service: MonitorLoadWorkspaceService) {}

  @Get()
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Retrieves official load records for a monitor location',
  })
  getLoads(@Param('locId') locationId: string): Promise<MonitorLoadDTO[]> {
    return this.service.getLoads(locationId);
  }

  @Put(':loadId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: MonitorLoadDTO,
    description: 'Updates a workspace load record for a monitor location',
  })
  async updateLoad(
    @Param('locId') locationId: string,
    @Param('loadId') spanId: string,
    @Body() payload: MonitorLoadBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorLoadDTO> {
    return this.service.updateLoad(locationId, spanId, payload, user.userId);
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
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Creates a workspace load record for a monitor location',
  })
  createLoad(
    @Param('locId') locationId: string,
    @Body() payload: MonitorLoadBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorLoadDTO> {
    return this.service.createLoad(locationId, payload, user.userId);
  }
}
