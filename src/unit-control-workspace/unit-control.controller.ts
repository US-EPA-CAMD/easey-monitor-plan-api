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
import { UpdateUnitControlDTO } from '../dtos/unit-control-update.dto';
import { UnitControlDTO } from '../dtos/unit-control.dto';

import { UnitControlWorkspaceService } from './unit-control.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import CurrentUser from '@us-epa-camd/easey-common/decorators/current-user.decorator';
import { Logger } from '@us-epa-camd/easey-common/logger';

@ApiTags('Unit Controls')
@Controller()
export class UnitControlWorkspaceController {
  constructor(
    private readonly service: UnitControlWorkspaceService,
    private Logger: Logger,
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
    @Param('unitRecordId') unitRecordId: number,
  ): Promise<UnitControlDTO[]> {
    return this.service.getUnitControls(locId, unitRecordId);
  }

  @Put(':unitControlId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: UnitControlDTO,
    description: 'Updates a workspace unit control record by unit control ID',
  })
  async updateUnitControl(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('unitRecordId') unitRecordId: number,
    @Param('unitControlId') unitControlId: string,
    @Body() payload: UpdateUnitControlDTO,
  ): Promise<UnitControlDTO> {
    this.Logger.info('Updating Unit Control', {
      userId: userId,
      unitRecordId: unitRecordId,
      unitControlId: unitControlId,
      payload: payload,
    });
    return this.service.updateUnitControl(
      userId,
      locId,
      unitRecordId,
      unitControlId,
      payload,
    );
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: true,
    type: UnitControlDTO,
    description: 'Creates a workspace unit control record for a unit',
  })
  createUnitControl(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('unitRecordId') unitRecordId: number,
    @Body() payload: UpdateUnitControlDTO,
  ): Promise<UnitControlDTO> {
    this.Logger.info('Creating Unit Control', {
      userId: userId,
      unitRecordId: unitRecordId,
      payload: payload,
    });
    return this.service.createUnitControl(userId, locId, unitRecordId, payload);
  }
}
