import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { UpdateUnitCapacityDTO } from '../dtos/unit-capacity-update.dto';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';

@ApiTags('Unit Capacities')
@Controller()
export class UnitCapacityWorkspaceController {
  constructor(
    private readonly service: UnitCapacityWorkspaceService,
    private readonly Logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitCapacityDTO,
    description:
      'Retrieves workspace unit capacity records from a specific unit ID',
  })
  getUnitCapacities(
    @Param('locId') locationId: string,
    @Param('unitRecordId') unitRecordId: number,
  ): Promise<UnitCapacityDTO[]> {
    return this.service.getUnitCapacities(locationId, unitRecordId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: true,
    type: UnitCapacityDTO,
    description: 'Creates a workspace unit capacity record for a unit',
  })
  createUnitCapcity(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('unitRecordId') unitRecordId: number,
    @Body() payload: UpdateUnitCapacityDTO,
  ): Promise<UnitCapacityDTO> {
    this.Logger.info('Creating Unit Capcity', {
      userId: userId,
      unitRecordId: unitRecordId,
      payload: payload,
    });
    return this.service.createUnitCapacity(
      userId,
      locId,
      unitRecordId,
      payload,
    );
  }

  @Put(':unitCapacityId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: UnitCapacityDTO,
    description: 'Updates a workspace unit capacity record by unit capacity ID',
  })
  async updateUnitCapacity(
    @Param('locId') locationId: string,
    @Param('unitRecordId') unitRecordId: number,
    @Param('unitCapacityId') unitCapacityId: string,
    @Body() payload: UpdateUnitCapacityDTO,
    @CurrentUser() userId: string,
  ): Promise<UnitCapacityDTO> {
    this.Logger.info('Updating Unit Capacity', {
      userId,
      unitRecordId,
      unitCapacityId,
      payload,
    });
    return this.service.updateUnitCapacity(
      userId,
      locationId,
      unitRecordId,
      unitCapacityId,
      payload,
    );
  }
}
