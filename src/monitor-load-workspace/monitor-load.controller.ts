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
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadBaseDTO, MonitorLoadDTO } from '../dtos/monitor-load.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Loads')
export class MonitorLoadWorkspaceController {
  constructor(
    private readonly service: MonitorLoadWorkspaceService,
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorLoadDTO,
    description: 'Updates a workspace load record for a monitor location',
  })
  async updateLoad(
    @Param('locId') locationId: string,
    @Param('loadId') spanId: string,
    @Body() payload: MonitorLoadBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorLoadDTO> {
    return this.service.updateLoad(locationId, spanId, payload, user.userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Creates a workspace load record for a monitor location',
  })
  createLoad(
    @Param('locId') locationId: string,
    @Body() payload: MonitorLoadBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorLoadDTO> {
    return this.service.createLoad(locationId, payload, user.userId);
  }
}
