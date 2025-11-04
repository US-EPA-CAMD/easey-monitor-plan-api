import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  LMEQualificationBaseDTO,
  LMEQualificationDTO,
} from '../dtos/lme-qualification.dto';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LME Qualifications')
@ApiExcludeControllerByEnv()
@ApiExtraModels(LMEQualificationDTO)
export class LMEQualificationWorkspaceController {
  constructor(private readonly service: LMEQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace lme qualification records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(LMEQualificationDTO) },
              },
            },
          },
        },
      }
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
    label: 'Retrieved workspace monitor location LME qualifications',
    requestParamsOutFields: ['locId', 'qualId']
  })
  async getLMEQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<ArrayResponse<LMEQualificationDTO>> {
    const lmeQualifications = await this.service.getLMEQualifications(locationId, qualificationId);

    return  {
      items: lmeQualifications
    }
  }

  @Put(':lmeQualId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location LME qualification record',
    requestParamsOutFields: ['locId', 'qualId', 'lmeQualId'],
    responseBodyOutFields: '*'
  })
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
    await this.service.runChecks(payload, qualId, lmeQualId);
    return this.service.updateLMEQualification({
      locationId: locId,
      qualId,
      lmeQualId,
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
    label: 'Created workspace monitor location LME qualification record',
    requestParamsOutFields: ['locId', 'qualId'],
    responseBodyOutFields: '*'
  })
  @ApiOkResponse({
    type: LMEQualificationDTO,
    description:
      'Creates an LME Qualification record for a qualification and monitor location',
  })
  async createLMEQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: LMEQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LMEQualificationDTO> {
    await this.service.runChecks(payload, qualId);
    return this.service.createLMEQualification({
      locationId: locId,
      qualId,
      payload,
      userId: user.userId,
    });
  }
}
