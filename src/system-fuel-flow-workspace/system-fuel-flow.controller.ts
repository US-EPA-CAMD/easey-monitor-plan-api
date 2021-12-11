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

import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { UpdateSystemFuelFlowDTO } from '../dtos/system-fuel-flow-update.dto';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Fuel Flows')
export class SystemFuelFlowWorkspaceController {
  constructor(
    private readonly service: SystemFuelFlowWorkspaceService,
    private Logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: SystemFuelFlowDTO,
    description: 'Retrieves workspace fuel flow records for a monitor system',
  })
  getFuelFlows(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemFuelFlowDTO[]> {
    return this.service.getFuelFlows(monSysId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: SystemFuelFlowDTO,
    description: 'Creates official fuel flow records for a monitor system',
  })
  async createFuelFlow(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemRecordId: string,
    @Body() payload: UpdateSystemFuelFlowDTO,
    @CurrentUser() userId: string,
  ): Promise<SystemFuelFlowDTO> {
    this.Logger.info('Creating Fuel Flow', {
      locationId: locationId,
      monitoringSystemRecordId: monitoringSystemRecordId,
      payload: payload,
      userId: userId,
    });
    return this.service.createFuelFlow(monitoringSystemRecordId, payload);
  }

  @Put(':fuelFlowId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: SystemFuelFlowDTO,
    description:
      'Updates workspace system fuel flow record for a monitor system',
  })
  updateSystemFlow(
    @Param('locId') locationId: string,
    @Param('sysId') monitoringSystemRecordId: string,
    @Param('fuelFlowId') id: string,
    @Body() payload: UpdateSystemFuelFlowDTO,
    @CurrentUser() userId: string,
  ): Promise<SystemFuelFlowDTO> {
    this.Logger.info('Updating fuel flow', {
      locationId: locationId,
      monitoringSystemRecordId: monitoringSystemRecordId,
      id: id,
      payload: payload,
      userId: userId,
    });
    return this.service.updateFuelFlow(id, payload);
  }
}
