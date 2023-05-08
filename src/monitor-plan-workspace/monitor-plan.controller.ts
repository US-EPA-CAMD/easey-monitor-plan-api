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

import { MonitorPlanWorkspaceService } from './monitor-plan.service';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { ImportChecksService } from '../import-checks/import-checks.service';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { MonitorPlanChecksService } from './monitor-plan-checks.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Plans')
export class MonitorPlanWorkspaceController {
  constructor(
    private readonly service: MonitorPlanWorkspaceService,
    private readonly logger: Logger,
    private readonly importChecksService: ImportChecksService,
    private readonly mpChecksService: MonitorPlanChecksService,
  ) {}

  @Get('export')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves workspace Monitor Plan record.',
  })
  @RoleGuard(
    { enforceCheckout: false, queryParam: 'planId' },
    LookupType.MonitorPlan,
  )
  exportMonitorPlan(@Query('planId') planId: string) {
    return this.service.exportMonitorPlan(planId);
  }

  // TEMP: unconventional route path to avoid messing with URL's before demo
  @Get(':planId')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves information needed to refresh a monitor plan',
  })
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'planId' },
    LookupType.MonitorPlan,
  )
  getMonitorPlan(@Param('planId') planId: string): Promise<MonitorPlanDTO> {
    return this.service.getMonitorPlan(planId);
  }

  @Post('import')
  @RoleGuard({ importLocationSources: ['locations'] }, LookupType.Location)
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'imports an entire monitor plan from JSON payload',
  })
  async importPlan(
    @Body() plan: UpdateMonitorPlanDTO,
    @User() user: CurrentUser,
  ): Promise<any> {
    await this.mpChecksService.runChecks(plan);
    await this.importChecksService.runImportChecks(plan);
    const mpPlan = await this.service.importMpPlan(plan, user.userId);

    if (mpPlan === null) {
      return {
        message: `Monitoring plan imported successfully`,
      };
    }

    return mpPlan;
  }

  @Delete(':planId/revert')
  @RoleGuard({ pathParam: 'planId' }, LookupType.MonitorPlan)
  @ApiOkResponse({
    description:
      'Revert workspace monitor plan back to official submitted record',
  })
  revertToOfficialRecord(@Param('planId') planId: string): Promise<void> {
    return this.service.revertToOfficialRecord(planId);
  }
}
