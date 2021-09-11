import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';

import { SystemComponentWorkspaceService } from './system-component.service';
import { SystemComponentDTO } from '../dtos/system-component.dto';
import { UpdateSystemComponentDTO } from '../dtos/system-component-update.dto';

@ApiTags('System Components')
@Controller()
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
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Updates workspace component records for a monitor system',
  })
  async upDateComponent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @Param('compId') componentId: string,
    @Body() payload: UpdateSystemComponentDTO,
  ): Promise<SystemComponentDTO> {
    return this.service.updateComponent(
      locationId,
      monSysId,
      componentId,
      payload,
    );
  }

  @Post()
  @ApiOkResponse({
    type: SystemComponentDTO,
    description: 'Creates a workspace system component for a monitor system',
  })
  createSystemComponent(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
    @Body() payload: UpdateSystemComponentDTO,
  ): Promise<SystemComponentDTO> {
    return this.service.createSystemComponent(locationId, monSysId, payload);
  }
}
