import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { UnitControlBaseDTO, UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlWorkspaceService } from './unit-control.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Controls')
export class UnitControlWorkspaceController {
  constructor(private readonly service: UnitControlWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitControlDTO,
    description:
      'Retrieves workspace unit control records from a specific unit ID',
  })
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  getUnitControls(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<UnitControlDTO[]> {
    return this.service.getUnitControls(locId, unitId);
  }

  @Put(':unitControlId')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    type: UnitControlDTO,
    description: 'Updates a workspace unit control record by unit control ID',
  })
  async updateUnitControl(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Param('unitControlId') unitControlId: string,
    @Body() payload: UnitControlBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitControlDTO> {
    return this.service.updateUnitControl(
      locId,
      unitId,
      unitControlId,
      payload,
      user.userId,
    );
  }

  @Post()
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    isArray: true,
    type: UnitControlDTO,
    description: 'Creates a workspace unit control record for a unit',
  })
  createUnitControl(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Body() payload: UnitControlBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitControlDTO> {
    return this.service.createUnitControl(locId, unitId, payload, user.userId);
  }
}
