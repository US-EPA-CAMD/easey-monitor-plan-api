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
  ApiBearerAuth,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { UpdateUnitCapacityDTO } from '../dtos/unit-capacity-update.dto';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Capacities')
export class UnitCapacityWorkspaceController {
  constructor(
    private readonly service: UnitCapacityWorkspaceService,
    private readonly logger: Logger,
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
    @Param('unitId') unitId: number,
  ): Promise<UnitCapacityDTO[]> {
    return this.service.getUnitCapacities(locationId, unitId);
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
    @Param('unitId') unitId: number,
    @Body() payload: UpdateUnitCapacityDTO,
  ): Promise<UnitCapacityDTO> {
    this.logger.info('Creating Unit Capcity', {
      userId,
      unitId,
      payload,
    });
    return this.service.createUnitCapacity(userId, locId, unitId, payload);
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
    @Param('unitId') unitId: number,
    @Param('unitCapacityId') unitCapacityId: string,
    @Body() payload: UpdateUnitCapacityDTO,
    @CurrentUser() userId: string,
  ): Promise<UnitCapacityDTO> {
    this.logger.info('Updating Unit Capacity', {
      userId,
      unitId,
      unitCapacityId,
      payload,
    });
    return this.service.updateUnitCapacity(
      userId,
      locationId,
      unitId,
      unitCapacityId,
      payload,
    );
  }
}
