import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import {
  LEEQualificationBaseDTO,
  LEEQualificationDTO,
} from '../dtos/lee-qualification.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LEE Qualifications')
export class LEEQualificationWorkspaceController {
  constructor(private readonly service: LEEQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LEEQualificationDTO,
    description:
      'Retrieves workspace lee qualification records for a monitor location',
  })
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
  getLEEQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<LEEQualificationDTO[]> {
    return this.service.getLEEQualifications(locId, qualId);
  }

  @Put(':leeQualId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP', 'DPMP'],
    },
    LookupType.Location,
  )
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
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP', 'DPMP'],
    },
    LookupType.Location,
  )
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
    return this.service.createLEEQualification(
      locId,
      qualId,
      payload,
      user.userId,
    );
  }
}
