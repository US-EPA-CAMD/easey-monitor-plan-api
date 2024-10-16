import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { UnitFuelBaseDTO, UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelWorkspaceService } from './unit-fuel.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Fuels')
export class UnitFuelWorkspaceController {
  constructor(private readonly service: UnitFuelWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitFuelDTO,
    description:
      'Retrieves workspace unit control records from a specific unit ID',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getUnitFuels(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<UnitFuelDTO[]> {
    return this.service.getUnitFuels(locId, unitId);
  }

  @Put(':unitFuelId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: UnitFuelDTO,
    description: 'Updates a workspace unit control record by unit control ID',
  })
  async updateUnitFuel(
    @Param('locId') locId: string,
    @Param('unitFuelId') unitFuelId: string,
    @Body() payload: UnitFuelBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitFuelDTO> {
    return this.service.updateUnitFuel({
      locationId: locId,
      unitFuelId,
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
  @ApiOkResponse({
    isArray: true,
    type: UnitFuelDTO,
    description: 'Creates a workspace unit control record for a unit',
  })
  createUnitFuel(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Body() payload: UnitFuelBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitFuelDTO> {
    return this.service.createUnitFuel({
      locationId: locId,
      unitId,
      payload,
      userId: user.userId,
    });
  }
}
