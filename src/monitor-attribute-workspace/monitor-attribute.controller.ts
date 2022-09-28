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
  UseGuards,
  Body,
  Put,
} from '@nestjs/common';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  MonitorAttributeBaseDTO,
  MonitorAttributeDTO,
} from '../dtos/monitor-attribute.dto';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Attributes')
export class MonitorAttributeWorkspaceController {
  constructor(
    private readonly service: MonitorAttributeWorkspaceService,
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorAttributeDTO,
    description: 'Creates a workspace monitor location attribute record',
  })
  createAttribute(
    @Param('locId') locationId: string,
    @Body() payload: MonitorAttributeBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorAttributeDTO> {
    return this.service.createAttribute(locationId, payload, user.userId);
  }

  @Put(':attributeId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorAttributeDTO,
    description: 'Updates a workspace monitor location attribute record',
  })
  updateAttribute(
    @Param('locId') locationId: string,
    @Param('attributeId') id: string,
    @Body() payload: MonitorAttributeBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorAttributeDTO> {
    return this.service.updateAttribute(locationId, id, payload, user.userId);
  }
}
