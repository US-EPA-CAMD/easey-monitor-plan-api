import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import {
  MonitorQualificationBaseDTO,
  MonitorQualificationDTO,
} from '../dtos/monitor-qualification.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Qualifications')
export class MonitorQualificationWorkspaceController {
  constructor(private readonly service: MonitorQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorQualificationDTO,
    description:
      'Retrieves workspace qualification records for a monitor location',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getQualifications(
    @Param('locId') locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    return this.service.getQualifications(locationId);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: MonitorQualificationDTO,
    description:
      'Creates a workspace qualification record for a given location',
  })
  createQualification(
    @Param('locId') locationId: string,
    @Body() payload: MonitorQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorQualificationDTO> {
    return this.service.createQualification({
      locationId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':qualId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: MonitorQualificationDTO,
    description:
      'Updates a workspace monitor qualification record for a given monitor location',
  })
  updateQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: MonitorQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorQualificationDTO> {
    return this.service.updateQualification({
      locationId: locId,
      qualId,
      payload,
      userId: user.userId,
    });
  }
}
