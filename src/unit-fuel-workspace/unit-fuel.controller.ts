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
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor location unit fuels',
    requestParamsOutFields:['locId', 'unitId']
  })
  async getUnitFuels(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitFuelDTO>> {
    const unitFuelDTOS = await this.service.getUnitFuels(locId, unitId);

    return  {
      items: unitFuelDTOS
    }
  }

  @Put(':unitFuelId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location unit fuel record',
    requestParamsOutFields:['locId', 'unitFuelId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: UnitFuelDTO,
    description: 'Updates a workspace unit control record by unit control ID',
  })
  async updateUnitFuel(
    @Param('locId') locId: string,
    @Param('unitFuelId') unitFuelId: string,
    @Body() payload: UnitFuelBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitFuelDTO> {
    return this.service.updateUnitFuel({
      locationId: locId,
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
    LookupType.Location,
  )
  @AuditLog({
    label: 'Created workspace monitor location unit fuel record',
    requestParamsOutFields:['locId', 'unitId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: UnitFuelDTO,
    description: 'Creates a workspace unit control record for a unit',
  })
  createUnitFuel(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Body() payload: UnitFuelBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitFuelDTO> {
    return this.service.createUnitFuel({
      locationId: locId,
      unitId,
      payload,
      userId: user.userId,
    });
  }
}
