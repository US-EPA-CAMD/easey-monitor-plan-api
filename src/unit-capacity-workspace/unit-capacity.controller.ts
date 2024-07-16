import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  UnitCapacityBaseDTO,
  UnitCapacityDTO,
} from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Capacities')
export class UnitCapacityWorkspaceController {
  constructor(private readonly service: UnitCapacityWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitCapacityDTO,
    description:
      'Retrieves workspace unit capacity records from a specific unit ID',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getUnitCapacities(
    @Param('locId') locationId: string,
    @Param('unitId') unitId: number,
  ): Promise<UnitCapacityDTO[]> {
    return this.service.getUnitCapacities(locationId, unitId);
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
    type: UnitCapacityDTO,
    description: 'Creates a workspace unit capacity record for a unit',
  })
  createUnitCapcity(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Body() payload: UnitCapacityBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitCapacityDTO> {
    return this.service.createUnitCapacity(locId, unitId, payload, user.userId);
  }

  @Put(':unitCapacityId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: UnitCapacityDTO,
    description: 'Updates a workspace unit capacity record by unit capacity ID',
  })
  async updateUnitCapacity(
    @Param('locId') locationId: string,
    @Param('unitId') unitId: number,
    @Param('unitCapacityId') unitCapacityId: string,
    @Body() payload: UnitCapacityBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitCapacityDTO> {
    return this.service.updateUnitCapacity(
      locationId,
      unitId,
      unitCapacityId,
      payload,
      user.userId,
    );
  }
}
