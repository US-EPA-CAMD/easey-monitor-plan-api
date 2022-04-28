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
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
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
    @Body() payload: MonitorQualificationBaseDTO,
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
    @Body() payload: MonitorQualificationBaseDTO,
  ): Promise<MonitorQualificationDTO> {
    return this.service.updateQualification(userId, locId, qualId, payload);
  }
}
