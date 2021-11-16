import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  Get,
  Param,
  Controller,
  Put,
  UseGuards,
  Body,
  Post,
} from '@nestjs/common';

import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { UpdateLEEQualificationDTO } from '../dtos/lee-qualification-update.dto';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { Logger } from '@us-epa-camd/easey-common/logger';

@ApiTags('LEE Qualifications')
@Controller()
export class LEEQualificationWorkspaceController {
  constructor(
    private readonly service: LEEQualificationWorkspaceService,
    private Logger: Logger,
  ) { }

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LEEQualificationDTO,
    description:
      'Retrieves workspace lee qualification records for a monitor location',
  })
  getLEEQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<LEEQualificationDTO[]> {
    return this.service.getLEEQualifications(locId, qualId);
  }

  @Put(':leeQualId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: LEEQualificationDTO,
    description:
      'Updates a workspace LEE qualification by LEE qualification ID, qualification ID, and location ID',
  })
  async updateLEEQualification(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Param('leeQualId') leeQualId: string,
    @Body() payload: UpdateLEEQualificationDTO,
  ): Promise<LEEQualificationDTO> {
    this.Logger.info('Updating LEE qualification', {
      qualId: qualId,
      leeQualId: leeQualId,
      payload: payload,
      userId: userId,
    });
    return this.service.updateLEEQualification(
      userId,
      locId,
      qualId,
      leeQualId,
      payload,
    );
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: true,
    type: LEEQualificationDTO,
    description:
      'Creates a LEE Qualification record for a qualification and monitor location',
  })
  createLEEQualification(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: UpdateLEEQualificationDTO,
  ): Promise<LEEQualificationDTO> {
    this.Logger.info('Creating LEE Qualification', {
      userId: userId,
      locId: locId,
      qualId: qualId,
      payload: payload,
    });
    return this.service.createLEEQualification(userId, locId, qualId, payload);
  }
}
