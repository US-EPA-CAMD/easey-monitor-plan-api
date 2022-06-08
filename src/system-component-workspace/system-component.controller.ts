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
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
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

  @Put(':compId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Updates workspace component records for a monitor system',
  })
  async updateSystemCompnent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @Param('compId') componentId: string,
    @CurrentUser() userId: string,
    @Body() payload: SystemComponentBaseDTO,
  ): Promise<SystemComponentDTO> {
    return this.service.updateSystemComponent(
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
