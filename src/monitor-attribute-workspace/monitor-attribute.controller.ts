import { ApiTags, ApiOkResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import {
  Get,
  Param,
  Controller,
  Post,
  UseGuards,
  Body,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { UpdateMonitorAttributeDTO } from '../dtos/monitor-attribute-update.dto';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Attributes')
export class MonitorAttributeWorkspaceController {
  constructor(
    private readonly service: MonitorAttributeWorkspaceService,
    private logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorAttributeDTO,
    description: 'Retrieves workspace attribute records for a monitor location',
  })
  getAttributes(
    @Param('locId') locationId: string,
  ): Promise<MonitorAttributeDTO[]> {
    return this.service.getAttributes(locationId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorAttributeDTO,
    description: 'Creates a workspace monitor location attribute record',
  })
  createAttribute(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorAttributeDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorAttributeDTO> {
    this.logger.info('Creating new monitor location attribute', {
      locationId,
      payload,
      userId,
    });
    return this.service.createAttribute(locationId, payload, userId);
  }

  @Put(':attributeId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorAttributeDTO,
    description: 'Updates a workspace monitor location attribute record',
  })
  updateAttribute(
    @Param('locId') locationId: string,
    @Param('attributeId') id: string,
    @Body() payload: UpdateMonitorAttributeDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorAttributeDTO> {
    this.logger.info('Upding monitor attribute', {
      locationId,
      id,
      payload,
      userId,
    });

    return this.service.updateAttribute(locationId, id, payload, userId);
  }
}
