import {
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
  Controller,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UserCheckOutDTO } from '../dtos/user-check-out.dto';

import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import CurrentUser from '@us-epa-camd/easey-common/decorators/current-user.decorator';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { ImportChecksService } from '../import-checks/import-checks.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Plans & Configurations')
export class MonitorPlanWorkspaceController {
  constructor(
    private service: MonitorPlanWorkspaceService,
    private ucoService: UserCheckOutService,
    private logger: Logger,
    private importChecksService: ImportChecksService,
  ) {}

  // TODO: this & the GET check-outs interfer with each other as the route is not distinguisheable
  // really need to move check-outs to a controller of its own but that requires url changes

  // TEMP: unconventional route path to avoid messing with URL's before demo
  @Get(':planId/refresh')
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
    return this.service.getConfigurations(orisCode);
  }

  @Get(':planId/evaluation-report')
  @ApiOkResponse({
    description: 'Retrieves facility information and evaluation results',
  })
  getEvaluationReport(@Param('planId') planId: string) {
    return this.service.getEvaluationReport(planId);
  }

  @Get(':planId/export')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves workspace Monitor Plan record.',
  })
  exportMonitorPlan(@Param('planId') planId: string) {
    return this.service.exportMonitorPlan(planId);
  }

  @Post('import')
  @ApiBearerAuth('Token')
  //@UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'imports an entire monitor plan from JSON payload',
  })
  async importPlan(
    @Body() plan: UpdateMonitorPlanDTO,
  ): Promise<MonitorPlanDTO> {
    await this.importChecksService.mpFileChecks(plan);

    return;
  }

  @Get('check-outs')
  @ApiOkResponse({
    isArray: true,
    type: UserCheckOutDTO,
    description:
      'Retrieves workspace Monitor Plan configuration records that are checked out by users',
  })
  getCheckedOutConfigurations(): Promise<UserCheckOutDTO[]> {
    return this.ucoService.getCheckedOutConfigurations();
  }

  @Post(':planId/check-outs')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: UserCheckOutDTO,
    description: 'Checks Out a Monitor Plan configuration',
  })
  checkOutConfiguration(
    @Param('planId') planId: string,
    @CurrentUser() userId: string,
  ): Promise<UserCheckOutDTO> {
    return this.ucoService.checkOutConfiguration(planId, userId);
  }

  @Put(':planId/check-outs')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: UserCheckOutDTO,
    description: 'Updates last activity for a checked out Monitor Plan',
  })
  updateLastActivity(
    @Param('planId') planId: string,
  ): Promise<UserCheckOutDTO> {
    return this.ucoService.updateLastActivity(planId);
  }

  @Delete(':planId/check-outs')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Check-In a Monitor Plan configuration',
  })
  checkInConfiguration(
    @Param('planId') planId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    var returnVal;
    this.ucoService.checkInConfiguration(planId).then(res => {
      if (res) {
        returnVal = this.service.updateDateAndUserId(planId, userId);
        this.logger.info(
          'updated update date and user id for closed/checked-in plan.',
        );
      }
    });

    return returnVal;
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
