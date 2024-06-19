import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaChecksService } from './monitor-formula-checks.service';
import {
  MonitorFormulaBaseDTO,
  MonitorFormulaDTO,
} from '../dtos/monitor-formula.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Formulas')
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
  @ApiOkResponse({
    isArray: true,
    type: MonitorFormulaDTO,
    description: 'Retrieves workspace formula records for a monitor location',
  })
  getFormulas(
    @Param('locId') locationId: string,
  ): Promise<MonitorFormulaDTO[]> {
    return this.service.getFormulas(locationId);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
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
