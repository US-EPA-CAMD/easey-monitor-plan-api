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

import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import {
  MonitorQualificationBaseDTO,
  MonitorQualificationDTO,
} from '../dtos/monitor-qualification.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Qualifications')
export class MonitorQualificationWorkspaceController {
  constructor(private readonly service: MonitorQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorQualificationDTO,
    description:
      'Retrieves workspace qualification records for a monitor location',
  })
  getQualifications(
    @Param('locId') locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    return this.service.getQualifications(locationId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorQualificationDTO,
    description:
      'Creates a workspace qualification record for a given location',
  })
  createQualification(
    @Param('locId') locationId: string,
    @Body() payload: MonitorQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorQualificationDTO> {
    return this.service.createQualification(locationId, payload, user.userId);
  }

  @Put(':qualId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorQualificationDTO,
    description:
      'Updates a workspace monitor qualification record for a given monitor location',
  })
  updateQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: MonitorQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorQualificationDTO> {
    return this.service.updateQualification(locId, qualId, payload, user.userId);
  }
}
