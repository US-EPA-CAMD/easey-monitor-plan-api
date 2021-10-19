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
import { AuthGuard } from '../guards/auth.guard';
import CurrentUser from '../decorators/current-user.decorator';

@ApiTags('Unit Fuels')
@Controller()
export class UnitFuelWorkspaceController {
  constructor(private readonly service: UnitFuelWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitFuelDTO,
    description:
      'Retrieves workspace unit control records from a specific unit ID',
  })
  getUnitFuels(@Param('unitId') unitId: number): Promise<UnitFuelDTO[]> {
    return this.service.getUnitFuels(unitId);
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
    @Param('unitId') unitId: number,
    @Param('unitFuelId') unitFuelId: string,
    @Body() payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    return this.service.updateUnitFuel(userId, unitFuelId, unitId, payload);
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
    @Param('unitId') unitId: number,
    @Body() payload: UpdateUnitFuelDTO,
  ): Promise<UnitFuelDTO> {
    return this.service.createUnitFuel(userId, unitId, payload);
  }
}
