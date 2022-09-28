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

import { UnitControlBaseDTO, UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlWorkspaceService } from './unit-control.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Controls')
export class UnitControlWorkspaceController {
  constructor(
    private readonly service: UnitControlWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitControlDTO,
    description:
      'Retrieves workspace unit control records from a specific unit ID',
  })
  getUnitControls(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<UnitControlDTO[]> {
    return this.service.getUnitControls(locId, unitId);
  }

  @Put(':unitControlId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
