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
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  MonitorDefaultBaseDTO,
  MonitorDefaultDTO,
} from '../dtos/monitor-default.dto';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Defaults')
export class MonitorDefaultWorkspaceController {
  constructor(
    private readonly service: MonitorDefaultWorkspaceService,
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorDefaultDTO,
    description: 'Updates a workspace default record for a monitor location',
  })
  async updateDefault(
    @Param('locId') locationId: string,
    @Param('defaultId') defaultId: string,
    @Body() payload: MonitorDefaultBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorDefaultDTO> {
    return this.service.updateDefault(locationId, defaultId, payload, user.userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorDefaultDTO,
    description: 'Creates a workspace defaults record for a monitor location',
  })
  createDefault(
    @Param('locId') locationId: string,
    @Body() payload: MonitorDefaultBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorDefaultDTO> {
    return this.service.createDefault(locationId, payload, user.userId);
  }
}
