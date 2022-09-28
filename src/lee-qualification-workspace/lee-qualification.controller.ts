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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: LEEQualificationDTO,
    description:
      'Updates a workspace LEE qualification by LEE qualification ID, qualification ID, and location ID',
  })
  async updateLEEQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Param('leeQualId') leeQualId: string,
    @Body() payload: LEEQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LEEQualificationDTO> {
    return this.service.updateLEEQualification(
      locId,
      qualId,
      leeQualId,
      payload,
      user.userId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    isArray: true,
    type: LEEQualificationDTO,
    description:
      'Creates a LEE Qualification record for a qualification and monitor location',
  })
  createLEEQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: LEEQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LEEQualificationDTO> {
    return this.service.createLEEQualification(locId, qualId, payload, user.userId);
  }
}
