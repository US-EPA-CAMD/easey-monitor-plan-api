import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { ApiOkResponse, ApiTags, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { DuctWafBaseDTO, DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafWorkspaceService } from './duct-waf.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rectangular Duct WAF')
@ApiExcludeControllerByEnv()
@ApiExtraModels(DuctWafDTO)
export class DuctWafWorkspaceController {
  constructor(private readonly service: DuctWafWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves workspace duct waf records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(DuctWafDTO) },
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
    label: 'Retrieved workspace monitor location duct waf records',
    requestParamsOutFields:['locId']
  })
  async getDuctWafs(@Param('locId') locationId: string): Promise<ArrayResponse<DuctWafDTO>> {
    const ductWafs = await this.service.getDuctWafs(locationId);

    return  {
      items: ductWafs
    };
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
    label: 'Created workspace monitor location duct waf record',
    requestParamsOutFields:['locId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: DuctWafDTO,
    description: 'Create a workspace duct waf record for a monitor location',
  })
  async createDuctWaf(
    @Param('locId') locationId: string,
    @Body() payload: DuctWafBaseDTO,
    @User() user: CurrentUser,
  ): Promise<DuctWafDTO> {
    await this.service.runChecks(payload, locationId);
    return this.service.createDuctWaf({
      locationId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':ductWafId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location duct waf record',
    requestParamsOutFields:['locId', 'ductWafId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: DuctWafDTO,
    description: 'Updates a workspace duct waf record for a monitor location',
  })
  async updateDuctWaf(
    @Param('locId') locationId: string,
    @Param('ductWafId') ductWafId: string,
    @Body() payload: DuctWafBaseDTO,
    @User() user: CurrentUser,
  ): Promise<DuctWafDTO> {
    await this.service.runChecks(payload, locationId, ductWafId);
    return this.service.updateDuctWaf({
      locationId,
      ductWafId,
      payload,
      userId: user.userId,
    });
  }
}
