import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaChecksService } from './monitor-formula-checks.service';
import {
  MonitorFormulaBaseDTO,
  MonitorFormulaDTO,
} from '../dtos/monitor-formula.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Formulas')
@ApiExcludeControllerByEnv()
export class MonitorFormulaWorkspaceController {
  constructor(
    private readonly service: MonitorFormulaWorkspaceService,
    private readonly checksService: MonitorFormulaChecksService,
  ) {}

  @Get()
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor location formulas',
    requestParamsOutFields:['locId']
  })
  @ApiOkResponse({
    isArray: true,
    type: MonitorFormulaDTO,
    description: 'Retrieves workspace formula records for a monitor location',
  })
  async getFormulas(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorFormulaDTO>> {
    const formulas = await this.service.getFormulas(locationId);

    return  {
      items: formulas
    }
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
    label: 'Created workspace monitor location formula record',
    requestParamsOutFields:['locId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Creates workspace formula record for a monitor location',
  })
  async createFormula(
    @Param('locId') locationId: string,
    @Body() payload: MonitorFormulaBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorFormulaDTO> {
    await this.checksService.runChecks(payload, locationId);
    return this.service.createFormula({
      locationId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':formulaId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location formula record',
    requestParamsOutFields:['locId', 'formulaId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Updates workspace formula record for a monitor location',
  })
  async updateFormula(
    @Param('locId') locationId: string,
    @Param('formulaId') formulaRecordId: string,
    @Body() payload: MonitorFormulaBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorFormulaDTO> {
    await this.checksService.runChecks(payload, locationId, formulaRecordId);
    return this.service.updateFormula({
      locationId,
      formulaRecordId,
      payload,
      userId: user.userId,
    });
  }
}
