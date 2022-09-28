import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { UnitFuelBaseDTO, UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelWorkspaceService } from './unit-fuel.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Fuels')
export class UnitFuelWorkspaceController {
  constructor(
    private readonly service: UnitFuelWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitFuelDTO,
    description:
      'Retrieves workspace unit control records from a specific unit ID',
  })
  getUnitFuels(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<UnitFuelDTO[]> {
    return this.service.getUnitFuels(locId, unitId);
  }

  @Put(':unitFuelId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: UnitFuelDTO,
    description: 'Updates a workspace unit control record by unit control ID',
  })
  async updateUnitFuel(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Param('unitFuelId') unitFuelId: string,
    @Body() payload: UnitFuelBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitFuelDTO> {
    return this.service.updateUnitFuel(
      locId,
      unitId,
      unitFuelId,
      payload,
      user.userId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
    return this.service.createUnitFuel(locId, unitId, payload, user.userId);
  }
}
