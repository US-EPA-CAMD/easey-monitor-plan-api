import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import { ApiTags, ApiSecurity, ApiOkResponse } from '@nestjs/swagger';
import {
  CPMSQualificationBaseDTO,
  CPMSQualificationDTO,
} from '../dtos/cpms-qualification.dto';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('CPMS Qualifications')
export class CPMSQualificationWorkspaceController {
  constructor(private readonly service: CPMSQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: CPMSQualificationDTO,
    description:
      'Retrieves workspace CPMS qualification records for a monitor location',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getCPMSQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<CPMSQualificationDTO[]> {
    return this.service.getCPMSQualifications(locId, qualId);
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
    type: CPMSQualificationDTO,
    description:
      'Creates a CPMS Qualification record for a qualification and monitor location',
  })
  createCPMSQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: CPMSQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CPMSQualificationDTO> {
    return this.service.createCPMSQualification(
      locId,
      qualId,
      payload,
      user.userId,
    );
  }

  @Put(':cpmsQualId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP', 'DPMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: CPMSQualificationDTO,
    description:
      'Updates a workspace CPMS qualification by CPMS qualification ID, qualification ID, and location ID',
  })
  async updateCPMSQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Param('cpmsQualId') cpmsQualId: string,
    @Body() payload: CPMSQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CPMSQualificationDTO> {
    return this.service.updateCPMSQualification(
      locId,
      qualId,
      cpmsQualId,
      payload,
      user.userId,
    );
  }
}
