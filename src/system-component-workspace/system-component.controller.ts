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

import { SystemComponentWorkspaceService } from './system-component.service';
import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentBaseDTO } from '../dtos/system-component.dto';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Components')
export class SystemComponentWorkspaceController {
  constructor(private service: SystemComponentWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: SystemComponentDTO,
    description: 'Retrieves workspace component records for a monitor system',
  })
  async getComponents(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    return this.service.getComponents(locationId, monSysId);
  }

  @Put(':compId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Updates workspace component records for a monitor system',
  })
  async upDateComponent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @Param('compId') componentId: string,
    @CurrentUser() userId: string,
    @Body() payload: SystemComponentBaseDTO,
  ): Promise<SystemComponentDTO> {
    return this.service.updateComponent(
      locationId,
      monSysId,
      componentId,
      payload,
      userId,
    );
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Creates a workspace system component for a monitor system',
  })
  createSystemComponent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @CurrentUser() userId: string,
    @Body() payload: SystemComponentBaseDTO,
  ): Promise<SystemComponentDTO> {
    return this.service.createSystemComponent(
      locationId,
      monSysId,
      payload,
      userId,
    );
  }
}
