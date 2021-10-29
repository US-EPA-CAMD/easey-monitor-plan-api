import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  Get,
  Param,
  Controller,
  Post,
  UseGuards,
  Body,
  Put,
} from '@nestjs/common';

import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { UpdateMonitorQualificationDTO } from '../dtos/monitor-qualification-update.dto';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';

@ApiTags('Qualifications')
@Controller()
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
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorQualificationDTO,
    description:
      'Creates a workspace qualification record for a given location',
  })
  createQualification(
    @CurrentUser() userId: string,
    @Param('locId') locationId: string,
    @Body() payload: UpdateMonitorQualificationDTO,
  ): Promise<MonitorQualificationDTO> {
    return this.service.createQualification(userId, locationId, payload);
  }

  @Put(':qualId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorQualificationDTO,
    description:
      'Updates a workspace monitor qualification record for a given monitor location',
  })
  updateQualification(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: UpdateMonitorQualificationDTO,
  ): Promise<MonitorQualificationDTO> {
    return this.service.updateQualification(userId, locId, qualId, payload);
  }
}
