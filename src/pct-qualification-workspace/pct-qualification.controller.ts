import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  PCTQualificationBaseDTO,
  PCTQualificationDTO,
} from '../dtos/pct-qualification.dto';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('PCT Qualifications')
@ApiExcludeControllerByEnv()
@ApiExtraModels(PCTQualificationDTO)
export class PCTQualificationWorkspaceController {
  constructor(private readonly service: PCTQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace PCT Qualification records for a qualification ID and location ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(PCTQualificationDTO) },
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
    label: 'Retrieved workspace monitor location PCT qualifications',
    requestParamsOutFields: ['locId', 'qualId'],
  })
  async getPCTQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<ArrayResponse<PCTQualificationDTO>> {
    const pctQualificationDTOS = await this.service.getPCTQualifications(locId, qualId);

    return  {
      items: pctQualificationDTOS
    }
  }

  @Put(':pctQualId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location PCT qualification record',
    requestParamsOutFields: ['locId', 'qualId', 'pctQualId'],
    requestBodyOutFields: '*'
  })
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
    await this.service.runChecks(payload, qualId, pctQualId);
    return this.service.updatePCTQualification({
      locationId: locId,
      qualId,
      pctQualId,
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
    label: 'Created workspace monitor location PCT qualification record',
    requestParamsOutFields: ['locId', 'qualId'],
    requestBodyOutFields: '*'
  })
  @ApiOkResponse({
    type: PCTQualificationDTO,
    description:
      'Creates a PCT Qualification record for a qualification and monitor location',
  })
  async createPCTQualification(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
    @Body() payload: PCTQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<PCTQualificationDTO> {
    await this.service.runChecks(payload, qualId);
    return this.service.createPCTQualification({
      locationId: locId,
      qualId,
      payload,
      userId: user.userId,
    });
  }
}
