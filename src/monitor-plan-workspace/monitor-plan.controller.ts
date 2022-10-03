import {
  Get,
  Post,
  Body,
  Delete,
  Param,
  Controller,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';

import { MonitorPlanWorkspaceService } from './monitor-plan.service';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { ImportChecksService } from '../import-checks/import-checks.service';
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Plans & Configurations')
export class MonitorPlanWorkspaceController {
  constructor(
    private readonly service: MonitorPlanWorkspaceService,
    private readonly logger: Logger,
    private readonly importChecksService: ImportChecksService,
  ) {}

  @Get('export')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves workspace Monitor Plan record.',
  })
  exportMonitorPlan(@Query('planId') planId: string) {
    return this.service.exportMonitorPlan(planId);
  }

  // TEMP: unconventional route path to avoid messing with URL's before demo
  @Get(':planId')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves information needed to refresh a monitor plan',
  })
  getMonitorPlan(@Param('planId') planId: string): Promise<MonitorPlanDTO> {
    return this.service.getMonitorPlan(planId);
  }

  @Get(':orisCode/configurations')
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanDTO,
    description: 'Retrieves workspace Monitor Plan configurations',
  })
  getConfigurations(
    @Param('orisCode', ParseIntPipe) orisCode: number,
  ): Promise<MonitorPlanDTO[]> {
    return this.service.getConfigurationsByOris(orisCode);
  }

  @Get(':planId/evaluation-report')
  @ApiOkResponse({
    description: 'Retrieves facility information and evaluation results',
  })
  getEvaluationReport(@Param('planId') planId: string) {
    return this.service.getEvaluationReport(planId);
  }

  @Post('import')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'imports an entire monitor plan from JSON payload',
  })
  async importPlan(
    @Body() plan: MonitorPlanDTO,
    @User() user: CurrentUser,
  ): Promise<any> {
    await this.importChecksService.runImportChecks(plan);
    const mpPlan = await this.service.importMpPlan(plan, user.userId);

    // TODO: Temporary returned message
    if (mpPlan === null) {
      this.logger.info(`Monitoring plan Successfully Imported.`);
      return {
        message: `Monitoring plan Successfully Imported.`,
      };
    }

    return mpPlan;
  }

  @Delete(':planId/revert')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description:
      'Revert workspace monitor plan back to official submitted record',
  })
  revertToOfficialRecord(@Param('planId') planId: string): Promise<void> {
    return this.service.revertToOfficialRecord(planId);
  }
}
