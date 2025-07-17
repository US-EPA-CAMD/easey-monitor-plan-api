import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  UnitCapacityBaseDTO,
  UnitCapacityDTO,
} from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Capacities')
@ApiExcludeControllerByEnv()
@ApiExtraModels(UnitCapacityDTO)
export class UnitCapacityWorkspaceController {
  constructor(private readonly service: UnitCapacityWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace unit capacity records from a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitCapacityDTO) },
              },
            },
          },
        },
      }
  })
  @AuditLog({
    label: 'Retrieved workspace monitor location unit capacity records',
    requestParamsOutFields: ['unitId'],
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'unitId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Unit,
  )
  async getUnitCapacities(
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitCapacityDTO>> {
    const unitCapacityDTOS = await this.service.getUnitCapacities(unitId);

    return {
      items: unitCapacityDTOS,
    };
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'unitId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Unit,
  )
  @AuditLog({
    label: 'Create workspace monitor location unit capacity record',
    requestParamsOutFields: ['unitId'],
    requestBodyOutFields: '*',
  })
  @ApiOkResponse({
    isArray: true,
    type: UnitCapacityDTO,
    description: 'Creates a workspace unit capacity record for a unit',
  })
  createUnitCapcity(
    @Param('unitId') unitId: number,
    @Body() payload: UnitCapacityBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitCapacityDTO> {
    return this.service.createUnitCapacity({
      unitId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':unitCapacityId')
  @RoleGuard(
    {
      pathParam: 'unitId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Unit,
  )
  @AuditLog({
    label: 'Update workspace monitor location unit capacity record',
    requestParamsOutFields: ['unitId'],
    requestBodyOutFields: '*',
  })
  @ApiOkResponse({
    type: UnitCapacityDTO,
    description: 'Updates a workspace unit capacity record by unit capacity ID',
  })
  async updateUnitCapacity(
    @Param('unitId') unitId: number,
    @Param('unitCapacityId') unitCapacityId: string,
    @Body() payload: UnitCapacityBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitCapacityDTO> {
    return this.service.updateUnitCapacity({
      unitRecordId: unitId,
      unitCapacityId: unitCapacityId,
      payload,
      userId: user.userId,
    });
  }
}
