import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Get, Param, Controller, Put, UseGuards, Body, Post, } from '@nestjs/common';

import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { UpdateLMEQualificationDTO } from '../dtos/lme-qualification-update.dto';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { Logger } from '@us-epa-camd/easey-common/logger';

@ApiTags('LME Qualifications')
@Controller()
export class LMEQualificationWorkspaceController {
  constructor(private readonly service: LMEQualificationWorkspaceService) { }

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
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: LMEQualificationDTO,
    description:
      'Updates a workspace LME qualification by LME qualification ID, qualification ID, and location ID',
  })
  async updateLMEQualification(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Param('lmeQualId') lmeQualId: string,
    @Body() payload: UpdateLMEQualificationDTO,
  ): Promise<LMEQualificationDTO> {
    this.Logger.info('Updating LME qualification', {
      qualId: qualId,
      lmeQualId: lmeQualId,
      payload: payload,
      userId: userId,
    });
    return this.service.updateLMEQualification(
      userId,
      locId,
      qualId,
      lmeQualId,
      payload,
    );
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: true,
    type: LMEQualificationDTO,
    description:
      'Creates an LME Qualification record for a qualification and monitor location',
  })
  createLEEQualification(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: UpdateLMEQualificationDTO,
  ): Promise<LMEQualificationDTO> {
    this.Logger.info('Creating LME Qualification', {
      userId: userId,
      locId: locId,
      qualId: qualId,
      payload: payload,
    });
    return this.service.createLMEQualification(userId, locId, qualId, payload);
  }

}
