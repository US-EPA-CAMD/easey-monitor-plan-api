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
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import {
  LEEQualificationBaseDTO,
  LEEQualificationDTO,
} from '../dtos/lee-qualification.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LEE Qualifications')
export class LEEQualificationWorkspaceController {
  constructor(
    private readonly service: LEEQualificationWorkspaceService,
    private readonly logger: Logger,
  ) {}

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
    @Body() payload: LEEQualificationBaseDTO,
  ): Promise<LEEQualificationDTO> {
    this.logger.info('Updating LEE qualification', {
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
    @Body() payload: LEEQualificationBaseDTO,
  ): Promise<LEEQualificationDTO> {
    this.logger.info('Creating LEE Qualification', {
      userId: userId,
      locId: locId,
      qualId: qualId,
      payload: payload,
    });
    return this.service.createLEEQualification(userId, locId, qualId, payload);
  }
}
