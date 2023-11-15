import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  PCTQualificationBaseDTO,
  PCTQualificationDTO,
} from '../dtos/pct-qualification.dto';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('PCT Qualifications')
export class PCTQualificationWorkspaceController {
  constructor(private readonly service: PCTQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: PCTQualificationDTO,
    description:
      'Retrieves workspace PCT Qualification records for a qualification ID and location ID',
  })
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
  getPCTQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<PCTQualificationDTO[]> {
    return this.service.getPCTQualifications(locId, qualId);
  }

  @Put(':pctQualId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP', 'DPMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: PCTQualificationDTO,
    description:
      'Updates a workspace PCT qualification by PCT qualification ID, qualification ID, and location ID',
  })
  async updatePCTQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Param('pctQualId') pctQualId: string,
    @Body() payload: PCTQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<PCTQualificationDTO> {
    return this.service.updatePCTQualification(
      locId,
      qualId,
      pctQualId,
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
    type: PCTQualificationDTO,
    description:
      'Creates a PCT Qualification record for a qualification and monitor location',
  })
  createPCTQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: PCTQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<PCTQualificationDTO> {
    return this.service.createPCTQualification(
      locId,
      qualId,
      payload,
      user.userId,
    );
  }
}
