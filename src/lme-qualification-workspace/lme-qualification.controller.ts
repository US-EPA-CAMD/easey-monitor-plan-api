import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  LMEQualificationBaseDTO,
  LMEQualificationDTO,
} from '../dtos/lme-qualification.dto';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LME Qualifications')
export class LMEQualificationWorkspaceController {
  constructor(private readonly service: LMEQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LMEQualificationDTO,
    description:
      'Retrieves workspace lme qualification records for a monitor location',
  })
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
  getLMEQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<LMEQualificationDTO[]> {
    return this.service.getLMEQualifications(locationId, qualificationId);
  }

  @Put(':lmeQualId')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
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
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
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
    return this.service.createLMEQualification(
      locId,
      qualId,
      payload,
      user.userId,
    );
  }
}
