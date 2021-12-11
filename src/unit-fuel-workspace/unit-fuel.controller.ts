import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import CurrentUser from '@us-epa-camd/easey-common/decorators/current-user.decorator';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { UpdateUnitFuelDTO } from '../dtos/unit-fuel-update.dto';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';

import { UnitFuelWorkspaceService } from './unit-fuel.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Fuels')
export class UnitFuelWorkspaceController {
  constructor(
    private readonly service: UnitFuelWorkspaceService,
    private Logger: Logger,
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
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: UnitFuelDTO,
    description: 'Updates a workspace unit control record by unit control ID',
  })
  async updateUnitFuel(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Param('unitFuelId') unitFuelId: string,
    @Body() payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    this.Logger.info('Updating unit fuel', {
      unitId,
      unitFuelId,
      payload,
      userId,
    });
    return this.service.updateUnitFuel(
      userId,
      locId,
      unitId,
      unitFuelId,
      payload,
    );
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: true,
    type: UnitFuelDTO,
    description: 'Creates a workspace unit control record for a unit',
  })
  createUnitFuel(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Body() payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    this.Logger.info('Creating unit fuel', {
      unitId,
      payload,
      userId,
    });
    return this.service.createUnitFuel(userId, locId, unitId, payload);
  }
}
