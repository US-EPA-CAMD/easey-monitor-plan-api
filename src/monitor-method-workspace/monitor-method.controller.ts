import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Put, Post, Body, Param, Controller } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import {
  MonitorMethodBaseDTO,
  MonitorMethodDTO,
} from '../dtos/monitor-method.dto';
import { MonitorMethodWorkspaceService } from './monitor-method.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Methods')
export class MonitorMethodWorkspaceController {
  constructor(private service: MonitorMethodWorkspaceService) {}

  @Get()
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    isArray: true,
    type: MonitorMethodDTO,
    description: 'Retrieves workspace Monitor Method records',
  })
  getMethods(@Param('locId') locId: string): Promise<MonitorMethodDTO[]> {
    return this.service.getMethods(locId);
  }

  @Post()
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    type: MonitorMethodDTO,
    description: 'Creates workspace Monitor Method record',
  })
  createMethod(
    @Param('locId') locId: string,
    @Body() payload: MonitorMethodBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorMethodDTO> {
    return this.service.createMethod(locId, payload, user.userId);
  }

  @Put(':methodId')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    type: MonitorMethodDTO,
    description: 'Updates workspace Monitor Method record',
  })
  updateMethod(
    @Param('locId') locId: string,
    @Param('methodId') methodId: string,
    @Body() payload: MonitorMethodBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorMethodDTO> {
    return this.service.updateMethod(methodId, payload, locId, user.userId);
  }
}
