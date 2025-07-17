import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { UnitFuelBaseDTO, UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Fuels')
@ApiExcludeControllerByEnv()
@ApiExtraModels(UnitFuelDTO)
export class UnitFuelWorkspaceController {
  constructor(private readonly service: UnitFuelWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace unit control records from a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitFuelDTO) },
              },
            },
          },
        },
      }
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'unitId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Unit,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor location unit fuels',
    requestParamsOutFields: ['unitId'],
  })
  async getUnitFuels(
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitFuelDTO>> {
    const unitFuelDTOS = await this.service.getUnitFuels(unitId);

    return { items: unitFuelDTOS };
  }

  @Put(':unitFuelId')
  @RoleGuard(
    {
      pathParam: 'unitId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Unit,
  )
  @AuditLog({
    label: 'Updated workspace monitor location unit fuel record',
    requestParamsOutFields: ['unitId', 'unitFuelId'],
    responseBodyOutFields: '*',
  })
  @ApiOkResponse({
    type: UnitFuelDTO,
    description: 'Updates a workspace unit control record by unit control ID',
  })
  async updateUnitFuel(
    @Param('unitId') unitId: number,
    @Param('unitFuelId') unitFuelId: string,
    @Body() payload: UnitFuelBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitFuelDTO> {
    return this.service.updateUnitFuel({
      unitId,
      unitFuelId,
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
    LookupType.Unit,
  )
  @AuditLog({
    label: 'Created workspace monitor location unit fuel record',
    requestParamsOutFields: ['unitId'],
    responseBodyOutFields: '*',
  })
  @ApiOkResponse({
    isArray: true,
    type: UnitFuelDTO,
    description: 'Creates a workspace unit control record for a unit',
  })
  createUnitFuel(
    @Param('unitId') unitId: number,
    @Body() payload: UnitFuelBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitFuelDTO> {
    return this.service.createUnitFuel({
      unitId,
      payload,
      userId: user.userId,
    });
  }
}
