import { ApiTags, ApiOkResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import {
  Get,
  Param,
  Controller,
  Put,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';

import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { UpdateMonitorSystemDTO } from '../dtos/monitor-system-update.dto';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

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
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorSystemDTO,
    description: 'Creates a workspace system record for a give location',
  })
  createSystem(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorSystemDTO,
  ): Promise<MonitorSystemDTO> {
    return this.service.createSystem(locationId, payload);
  }

  @Put(':sysId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorSystemDTO,
    description:
      'Updates workspace monitor system record for a given monitor location',
  })
  updateSystem(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemId: string,
    @Body() payload: UpdateMonitorSystemDTO,
  ): Promise<MonitorSystemDTO> {
    return this.service.updateSystem(monitoringSystemId, payload);
  }
}
