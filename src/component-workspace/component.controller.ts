import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';

import { ComponentDTO, UpdateComponentBaseDTO } from '../dtos/component.dto';
import { ComponentWorkspaceService } from './component.service';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { ComponentCheckService } from './component-checks.service';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Components')
export class ComponentWorkspaceController {
  constructor(
    private readonly repository: ComponentWorkspaceRepository,
    private readonly service: ComponentWorkspaceService,
    private readonly checkService: ComponentCheckService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext('ComponentWorkspaceController');
  }

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
    return this.service.createComponent({
      locationId: locId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':compId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: ComponentDTO,
    description: 'Updates a component record',
  })
  async updateComponent(
    @Param('locId') locationId: string,
    @Param('compId') compId: string,
    @Body() payload: UpdateComponentBaseDTO,
    @User() user: CurrentUser,
  ): Promise<ComponentDTO> {
    return this.service.updateComponent({
      locationId,
      componentRecord: await this.repository.getComponentByLocIdAndCompId(
        locationId,
        compId,
      ),
      payload,
      userId: user.userId,
    });
  }
}
