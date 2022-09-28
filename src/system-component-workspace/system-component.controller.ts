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

import {
  SystemComponentBaseDTO,
  SystemComponentDTO,
} from '../dtos/system-component.dto';
import { SystemComponentWorkspaceService } from './system-component.service';

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
  async getSystemComponents(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    return this.service.getSystemComponents(locationId, monSysId);
  }

  @Put(':monSysCompId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Updates workspace component records for a monitor system',
  })
  async updateSystemCompnent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @Param('monSysCompId') monSysCompId: string,
    @Body() payload: SystemComponentBaseDTO,
    @User() user: CurrentUser,
  ): Promise<SystemComponentDTO> {
    return this.service.updateSystemComponent(
      locationId,
      monSysId,
      monSysCompId,
      payload,
      user.userId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Creates a workspace system component for a monitor system',
  })
  createSystemComponent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @Body() payload: SystemComponentBaseDTO,
    @User() user: CurrentUser,
  ): Promise<SystemComponentDTO> {
    return this.service.createSystemComponent(
      locationId,
      monSysId,
      payload,
      user.userId,
    );
  }
}
