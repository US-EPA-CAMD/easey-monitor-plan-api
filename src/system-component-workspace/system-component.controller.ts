import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  SystemComponentBaseDTO,
  SystemComponentDTO,
} from '../dtos/system-component.dto';
import { SystemComponentWorkspaceService } from './system-component.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Components')
export class SystemComponentWorkspaceController {
  constructor(
    private service: SystemComponentWorkspaceService,
    private checkService: ComponentCheckService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: SystemComponentDTO,
    description: 'Retrieves workspace component records for a monitor system',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getSystemComponents(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    return this.service.getSystemComponents(locationId, monSysId);
  }

  @Put(':monSysCompId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP', 'DPMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Updates workspace component records for a monitor system',
  })
  async updateSystemCompnent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @Param('monSysCompId') monSysCompId: string,
    @Body() payload: SystemComponentBaseDTO,
    @User() user: CurrentUser,
  ): Promise<SystemComponentDTO> {
    await this.checkService.runChecks(locationId, payload, false, true);
    return this.service.updateSystemComponent(
      locationId,
      monSysId,
      monSysCompId,
      payload,
      user.userId,
    );
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP', 'DPMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Creates a workspace system component for a monitor system',
  })
  async createSystemComponent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @Body() payload: SystemComponentBaseDTO,
    @User() user: CurrentUser,
  ): Promise<SystemComponentDTO> {
    await this.checkService.runChecks(locationId, payload, false, true);
    return this.service.createSystemComponent(
      locationId,
      monSysId,
      payload,
      user.userId,
    );
  }
}
