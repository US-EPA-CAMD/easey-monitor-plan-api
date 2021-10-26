import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUnitFuelDTO } from '../dtos/unit-fuel-update.dto';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';

import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import CurrentUser from '@us-epa-camd/easey-common/decorators/current-user.decorator';
import { Logger } from '@us-epa-camd/easey-common/logger';

@ApiTags('Unit Fuels')
@Controller()
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
    @Param('unitRecordId') unitRecordId: number,
  ): Promise<UnitFuelDTO[]> {
    return this.service.getUnitFuels(locId, unitRecordId);
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
    @Param('unitRecordId') unitRecordId: number,
    @Param('unitFuelId') unitFuelId: string,
    @Body() payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    this.Logger.info('Updating unit fuel', {
<<<<<<< HEAD
      unitId: unitId,
=======
      unitRecordId: unitRecordId,
>>>>>>> 68b225055840230155d417c9de094f2a4950bd18
      unitFuelId: unitFuelId,
      payload: payload,
      userId: userId,
    });
<<<<<<< HEAD
    return this.service.updateUnitFuel(userId, unitFuelId, unitId, payload);
=======
    return this.service.updateUnitFuel(
      userId,
      locId,
      unitRecordId,
      unitFuelId,
      payload,
    );
>>>>>>> 68b225055840230155d417c9de094f2a4950bd18
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
    @Param('unitRecordId') unitRecordId: number,
    @Body() payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    this.Logger.info('Creating unit fuel', {
      unitRecordId: unitRecordId,
      payload: payload,
      userId: userId,
    });
<<<<<<< HEAD
    return this.service.createUnitFuel(userId, unitId, payload);
=======
    return this.service.createUnitFuel(userId, locId, unitRecordId, payload);
>>>>>>> 68b225055840230155d417c9de094f2a4950bd18
  }
}
