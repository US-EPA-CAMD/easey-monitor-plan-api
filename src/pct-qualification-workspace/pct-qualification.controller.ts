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

import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { UpdatePCTQualificationDTO } from '../dtos/pct-qualification-update.dto';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('PCT Qualifications')
export class PCTQualificationWorkspaceController {
  constructor(
    private readonly service: PCTQualificationWorkspaceService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: PCTQualificationDTO,
    description:
      'Retrieves workspace PCT Qualification records for a qualification ID and location ID',
  })
  getPCTQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<PCTQualificationDTO[]> {
    return this.service.getPCTQualifications(locId, qualId);
  }

  @Put(':pctQualId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: PCTQualificationDTO,
    description:
      'Updates a workspace PCT qualification by PCT qualification ID, qualification ID, and location ID',
  })
  async updatePCTQualification(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Param('pctQualId') pctQualId: string,
    @Body() payload: UpdatePCTQualificationDTO,
  ): Promise<PCTQualificationDTO> {
    this.logger.info('Updating PCT qualification', {
      qualId: qualId,
      pctQualId: pctQualId,
      payload: payload,
      userId: userId,
    });
    return this.service.updatePCTQualification(
      userId,
      locId,
      qualId,
      pctQualId,
      payload,
    );
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: true,
    type: PCTQualificationDTO,
    description:
      'Creates a PCT Qualification record for a qualification and monitor location',
  })
  createPCTQualification(
    @CurrentUser() userId: string,
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: UpdatePCTQualificationDTO,
  ): Promise<PCTQualificationDTO> {
    this.logger.info('Creating PCT Qualification', {
      userId: userId,
      locId: locId,
      qualId: qualId,
      payload: payload,
    });
    return this.service.createPCTQualification(userId, locId, qualId, payload);
  }
}
