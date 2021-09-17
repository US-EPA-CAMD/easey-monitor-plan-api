import {
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
  Controller,
  ParseIntPipe,
  NotImplementedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';

import { UserDTO } from '../dtos/user.dto';
import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';

import { AuthGuard } from '../guards/auth.guard';
import CurrentUser from '../decorators/current-user.decorator';

@ApiTags('Plans & Configurations')
@Controller()
export class MonitorPlanWorkspaceController {
  constructor(
    private service: MonitorPlanWorkspaceService,
    private ucoService: UserCheckOutService,
  ) {}

  // TODO: this & the GET check-outs interfer with each other as the route is not distinguisheable
  // really need to move check-outs to a controller of its own but that requires url changes
  // @Get(':planId')
  // @ApiOkResponse({
  //   type: MonitorPlanDTO,
  //   description: 'Retrieves workspace Monitor Plan record',
  // })
  // getMonitorPlan(@Param('planId') planId: string): Promise<MonitorPlanDTO> {
  //   return this.service.getMonitorPlan(planId);
  // }

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

  @Post('import')
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'imports an entire monitor plan from JSON payload',
  })
  importPlan(@Body() plan: UpdateMonitorPlanDTO): Promise<MonitorPlanDTO> {
    console.log(plan);
    throw new NotImplementedException(
      'Monitor Plan Import not supported at this time. Coming Soon!',
    );
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
  checkInConfiguration(@Param('planId') planId: string): Promise<void> {
    return this.ucoService.checkInConfiguration(planId);
  }

  @Delete(':planId/revert')
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description:
      'Revert workspace monitor plan back to official submitted record',
  })
  revertToOfficialRecord(@Param('planId') planId: string): Promise<void> {
    return this.service.revertToOfficialRecord(planId);
  }
}
