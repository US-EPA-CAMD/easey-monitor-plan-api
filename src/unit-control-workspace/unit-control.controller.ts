import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { UnitControlBaseDTO, UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlChecksService } from './unit-control-checks.service';
import { UnitControlWorkspaceService } from './unit-control.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Controls')
@ApiExcludeControllerByEnv()
export class UnitControlWorkspaceController {
  constructor(
    private readonly service: UnitControlWorkspaceService,
    private readonly checksService: UnitControlChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitControlDTO,
    description:
      'Retrieves workspace unit control records from a specific unit ID',
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
    label: 'Retrieved workspace monitor location unit controls',
    requestParamsOutFields:['locId', 'unitId']
  })
  async getUnitControls(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitControlDTO>> {
    const unitCapacityDTOS = await this.service.getUnitControls(locId, unitId);

    return  {
      items: unitCapacityDTOS
    }
  }

  @Put(':unitControlId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location unit control record',
    requestParamsOutFields:['locId', 'unitId', 'unitControlId'],
    responseBodyOutFields:'*',
  })
  @ApiOkResponse({
    type: UnitControlDTO,
    description: 'Updates a workspace unit control record by unit control ID',
  })
  async updateUnitControl(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Param('unitControlId') unitControlId: string,
    @Body() payload: UnitControlBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitControlDTO> {
    await this.checksService.runChecks(unitId, payload, false, true);
    return this.service.updateUnitControl({
      locationId: locId,
      unitRecordId: unitId,
      unitControlId,
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
    label: 'Created workspace monitor location unit control record',
    requestParamsOutFields:['locId', 'unitId'],
    responseBodyOutFields:'*',
  })
  @ApiOkResponse({
    isArray: true,
    type: UnitControlDTO,
    description: 'Creates a workspace unit control record for a unit',
  })
  async createUnitControl(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
    @Body() payload: UnitControlBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitControlDTO> {
    await this.checksService.runChecks(unitId, payload);
    return this.service.createUnitControl({
      locationId: locId,
      unitRecordId: unitId,
      payload,
      userId: user.userId,
    });
  }
}
