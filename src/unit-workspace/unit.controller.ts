import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { UnitWorkspaceService } from './unit.service';
import { UnitBaseDTO, UnitDTO } from '../dtos/unit.dto';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Units')
@ApiExcludeControllerByEnv()
@ApiExtraModels(UnitDTO)
export class UnitWorkspaceController {
  constructor(private readonly service: UnitWorkspaceService) {}

  @Get(':id')
  @ApiOkResponse({
    description:
      'Retrieves workspace unit for a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitDTO) },
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
    label: 'Retrieved workspace monitor location unit',
    requestParamsOutFields: ['locId', 'id']
  })
  async getUnits(
    @Param('locId') locId: string,
    @Param('id') unitId: number,
  ): Promise<ArrayResponse<UnitDTO>> {
    const unitDTOS = await this.service.getUnits(locId, unitId);

    return  {
      items: unitDTOS
    }
  }

  @Put(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location unit',
    requestParamsOutFields: ['locId', 'id'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: UnitDTO,
    description: 'Updates a workspace unit record by unit ID',
  })
  async updateUnit(
    @Param('locId') locationId: string,
    @Param('id') unitId: number,
    @Body() payload: UnitBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitDTO> {
    return this.service.updateUnit(
      locationId,
      unitId,
      payload,
      user.userId,
    );
  }
}
