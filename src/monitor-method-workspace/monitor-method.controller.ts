import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Controller,
  UseGuards,
} from '@nestjs/common';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { UpdateMonitorMethodDTO } from '../dtos/monitor-method-update.dto';
import { MonitorMethodWorkspaceService } from './monitor-method.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Methods')
export class MonitorMethodWorkspaceController {
  constructor(private service: MonitorMethodWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorMethodDTO,
    description: 'Retrieves workspace Monitor Method records',
  })
  getMethods(@Param('locId') locId: string): Promise<MonitorMethodDTO[]> {
    return this.service.getMethods(locId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorMethodDTO,
    description: 'Creates workspace Monitor Method record',
  })
  createMethod(
    @Param('locId') locId: string,
    @Body() payload: UpdateMonitorMethodDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorMethodDTO> {
    return this.service.createMethod(locId, payload, userId);
  }

  @Put(':methodId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorMethodDTO,
    description: 'Updates workspace Monitor Method record',
  })
  updateMethod(
    @Param('locId') locId: string,
    @Param('methodId') methodId: string,
    @Body() payload: UpdateMonitorMethodDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorMethodDTO> {
    return this.service.updateMethod(methodId, payload, locId, userId);
  }
}
