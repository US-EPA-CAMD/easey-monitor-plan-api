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
  Put,
  UseGuards,
  Body,
  Post,
} from '@nestjs/common';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  LMEQualificationBaseDTO,
  LMEQualificationDTO,
} from '../dtos/lme-qualification.dto';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LME Qualifications')
export class LMEQualificationWorkspaceController {
  constructor(
    private readonly service: LMEQualificationWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LMEQualificationDTO,
    description:
      'Retrieves workspace lme qualification records for a monitor location',
  })
  getLMEQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<LMEQualificationDTO[]> {
    return this.service.getLMEQualifications(locationId, qualificationId);
  }

  @Put(':lmeQualId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: LMEQualificationDTO,
    description:
      'Updates a workspace LME qualification by LME qualification ID, qualification ID, and location ID',
  })
  async updateLMEQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Param('lmeQualId') lmeQualId: string,
    @Body() payload: LMEQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LMEQualificationDTO> {
    return this.service.updateLMEQualification(
      locId,
      qualId,
      lmeQualId,
      payload,
      user.userId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    isArray: true,
    type: LMEQualificationDTO,
    description:
      'Creates an LME Qualification record for a qualification and monitor location',
  })
  createLMEQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: LMEQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LMEQualificationDTO> {
    return this.service.createLMEQualification(locId, qualId, payload, user.userId);
  }
}
