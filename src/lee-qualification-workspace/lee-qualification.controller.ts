import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import {
  LEEQualificationBaseDTO,
  LEEQualificationDTO,
} from '../dtos/lee-qualification.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { DuctWafDTO } from '../dtos/duct-waf.dto';

const ArrayResponseLEEQualificationDTO = createArrayResponseDto(LEEQualificationDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LEE Qualifications')
@ApiExcludeControllerByEnv()
export class LEEQualificationWorkspaceController {
  constructor(private readonly service: LEEQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseLEEQualificationDTO,
    description:
      'Retrieves workspace lee qualification records for a monitor location',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor location LEE qualifications',
    requestParamsOutFields: ['locId', 'qualId']
  })
  async getLEEQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<ArrayResponse<LEEQualificationDTO>> {
    const leeQualifications = await this.service.getLEEQualifications(locId, qualId);

    return  {
      items: leeQualifications
    }
  }

  @Put(':leeQualId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location LEE qualification record',
    requestParamsOutFields: ['locId', 'qualId', 'leeQualId'],
    responseBodyOutFields:'*'
  })
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
    return this.service.updateLEEQualification({
      locationId: locId,
      qualId,
      pctQualId: leeQualId,
      payload,
      userId: user.userId,
    });
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
  @AuditLog({
    label: 'Created workspace monitor location LEE qualification record',
    requestParamsOutFields: ['locId', 'qualId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
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
    return this.service.createLEEQualification({
      locationId: locId,
      qualId,
      payload,
      userId: user.userId,
    });
  }
}
