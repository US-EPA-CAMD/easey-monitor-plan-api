import {
  Get,
  Post,
  Body,
  Delete,
  Param,
  Controller,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanImportResponseDTO } from '../dtos/monitor-plan-import-response.dto';
import { SingleUnitMonitorPlanRequestDTO } from '../dtos/single-unit-monitor-plan-request.dto';

import { MonitorPlanWorkspaceService } from './monitor-plan.service';

import { ImportChecksService } from '../import-checks/import-checks.service';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { MonitorPlanChecksService } from './monitor-plan-checks.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorPlanParamsDTO } from '../dtos/monitor-plan-params.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Plans')
export class MonitorPlanWorkspaceController {
  constructor(
    private readonly service: MonitorPlanWorkspaceService,
    private readonly importChecksService: ImportChecksService,
    private readonly mpChecksService: MonitorPlanChecksService,
  ) {}

  @Get('export')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves workspace Monitor Plan record.',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      queryParam: 'planId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.MonitorPlan,
  )
  exportMonitorPlan(@Query() params: MonitorPlanParamsDTO) {
    return this.service.exportMonitorPlan(
      params.planId,
      params.reportedValuesOnly,
    );
  }

  // TEMP: unconventional route path to avoid messing with URL's before demo
  @Get(':planId')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves information needed to refresh a monitor plan',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'planId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.MonitorPlan,
  )
  getMonitorPlan(@Param('planId') planId: string): Promise<MonitorPlanDTO> {
    return this.service.getMonitorPlan(planId);
  }

  @Post('import')
  @RoleGuard(
    {
      importLocationSources: ['locations'],
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: MonitorPlanImportResponseDTO,
    description: 'imports an entire monitor plan from JSON payload',
  })
  async importPlan(
    @Body() plan: UpdateMonitorPlanDTO,
    @User() user: CurrentUser,
    @Query('draft') draft: boolean,
  ): Promise<any> {
    await this.mpChecksService.runChecks(plan);
    await this.importChecksService.runImportChecks(plan);
    return await this.service.importMpPlan(plan, user.userId, draft);
  }

  @Post('single-unit')
  @RoleGuard(
    {
      bodyParam: 'orisCode',
    },
    LookupType.Facility,
  )
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description:
      'creates a new monitor plan for a single unit that has not been associated with any other plan',
  })
  async createNewSingleUnitMonitorPlan(
    @Body() payload: SingleUnitMonitorPlanRequestDTO,
    @User() user: CurrentUser,
    @Query('draft') draft: boolean,
  ) {
    return this.service.createNewSingleUnitMonitorPlan(
      payload.unitId,
      payload.orisCode,
      user.userId,
      draft,
    );
  }

  @Delete(':planId/revert')
  @RoleGuard(
    {
      pathParam: 'planId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.MonitorPlan,
  )
  @ApiOkResponse({
    description:
      'Revert workspace monitor plan back to official submitted record',
  })
  revertToOfficialRecord(@Param('planId') planId: string) {
    return this.service.revertToOfficialRecord(planId);
  }
}
