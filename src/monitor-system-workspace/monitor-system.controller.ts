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

import { MonitorSystemWorkspaceService } from './monitor-system.service';
import {
  MonitorSystemBaseDTO,
  MonitorSystemDTO,
} from '../dtos/monitor-system.dto';

@Controller()
@ApiTags('Systems')
@ApiSecurity('APIKey')
export class MonitorSystemWorkspaceController {
  constructor(private service: MonitorSystemWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSystemDTO,
    description:
      'Retrieves workspace system records for a given monitor location',
  })
  getSystems(@Param('locId') locationId: string): Promise<MonitorSystemDTO[]> {
    return this.service.getSystems(locationId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorSystemDTO,
    description: 'Creates a workspace system record for a give location',
  })
  createSystem(
    @Param('locId') locationId: string,
    @Body() payload: MonitorSystemBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorSystemDTO> {
    return this.service.createSystem(locationId, payload, user.userId);
  }

  @Put(':sysId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorSystemDTO,
    description:
      'Updates workspace monitor system record for a given monitor location',
  })
  updateSystem(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemId: string,
    @Body() payload: MonitorSystemBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorSystemDTO> {
    return this.service.updateSystem(
      monitoringSystemId,
      payload,
      locationId,
      user.userId,
    );
  }
}
