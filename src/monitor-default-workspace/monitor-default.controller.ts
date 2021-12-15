import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  Get,
  Param,
  Controller,
  Put,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';

import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { UpdateMonitorDefaultDTO } from '../dtos/monitor-default-update.dto';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Defaults')
export class MonitorDefaultWorkspaceController {
  constructor(
    private readonly service: MonitorDefaultWorkspaceService,
    private Logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorDefaultDTO,
    description: 'Retrieves workspace default records for a monitor location',
  })
  getDefaults(
    @Param('locId') locationId: string,
  ): Promise<MonitorDefaultDTO[]> {
    return this.service.getDefaults(locationId);
  }

  @Put(':defaultId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorDefaultDTO,
    description: 'Updates a workspace default record for a monitor location',
  })
  async updateDefault(
    @Param('locId') locationId: string,
    @Param('defaultId') defaultId: string,
    @Body() payload: UpdateMonitorDefaultDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorDefaultDTO> {
    this.Logger.info('Updating Monitor Default', {
      locationId: locationId,
      defaultId: defaultId,
      payload: payload,
      userId: userId,
    });
    return this.service.updateDefault(locationId, defaultId, payload, userId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorDefaultDTO,
    description: 'Creates a workspace defaults record for a monitor location',
  })
  createDefault(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorDefaultDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorDefaultDTO> {
    this.Logger.info('Creating new monitor default', {
      locationId: locationId,
      payload: payload,
      userId: userId,
    });
    return this.service.createDefault(locationId, payload, userId);
  }
}
