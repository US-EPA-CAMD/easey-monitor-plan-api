import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body } from '@nestjs/common';

import { ComponentDTO, UpdateComponentBaseDTO } from '../dtos/component.dto';
import { ComponentWorkspaceService } from './component.service';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { ComponentCheckService } from './component-checks.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Components')
export class ComponentWorkspaceController {
  constructor(
    private readonly service: ComponentWorkspaceService,
    private readonly checkService: ComponentCheckService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ComponentDTO,
    description: 'Retrieves workspace component records for a monitor location',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getComponents(@Param('locId') locationId: string): Promise<ComponentDTO[]> {
    return this.service.getComponents(locationId);
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
    isArray: true,
    type: ComponentDTO,
    description: 'Creates a component',
  })
  async createComponent(
    @Param('locId') locId: string,
    @Body() payload: UpdateComponentBaseDTO,
    @User() user: CurrentUser,
  ): Promise<ComponentDTO> {
    await this.checkService.runChecks(locId, payload, false, true);
    return this.service.createComponent(locId, payload, user.userId);
  }
}
