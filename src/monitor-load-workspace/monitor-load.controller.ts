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
  Post,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { UpdateMonitorLoadDTO } from '../dtos/monitor-load-update.dto';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Loads')
export class MonitorLoadWorkspaceController {
  constructor(
    private readonly service: MonitorLoadWorkspaceService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Retrieves official load records for a monitor location',
  })
  getLoads(@Param('locId') locationId: string): Promise<MonitorLoadDTO[]> {
    return this.service.getLoads(locationId);
  }

  @Put(':loadId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorLoadDTO,
    description: 'Updates a workspace load record for a monitor location',
  })
  async updateLoad(
    @Param('locId') locationId: string,
    @Param('loadId') spanId: string,
    @Body() payload: UpdateMonitorLoadDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorLoadDTO> {
    this.logger.info('Updating Load', {
      locationId: locationId,
      spanId: spanId,
      payload: payload,
      userId: userId,
    });
    return this.service.updateLoad(locationId, spanId, payload, userId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Creates a workspace load record for a monitor location',
  })
  createLoad(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorLoadDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorLoadDTO> {
    this.logger.info('Creating Load', {
      locationId: locationId,
      payload: payload,
      userId: userId,
    });
    return this.service.createLoad(locationId, payload, userId);
  }
}
