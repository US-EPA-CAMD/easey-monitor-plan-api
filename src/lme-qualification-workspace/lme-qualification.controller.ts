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
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
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
    private readonly logger: Logger,
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
    @Body() payload: LMEQualificationBaseDTO,
  ): Promise<LMEQualificationDTO> {
    this.logger.info('Updating LME qualification', {
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
  createLMEQualification(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: LMEQualificationBaseDTO,
  ): Promise<LMEQualificationDTO> {
    this.logger.info('Creating LME Qualification', {
      userId: userId,
      locId: locId,
      qualId: qualId,
      payload: payload,
    });
    return this.service.createLMEQualification(userId, locId, qualId, payload);
  }
}
