import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOkResponse } from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  UserCheckOutBaseDTO,
  UserCheckOutDTO,
} from '../dtos/user-check-out.dto';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Check-Outs')
export class CheckOutController {
  constructor(
    private readonly ucoService: UserCheckOutService,
    private readonly mpWksService: MonitorPlanWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UserCheckOutDTO,
    description:
      'Retrieves workspace Monitor Plan configuration records that are checked out by users',
  })
  getCheckedOutConfigurations(): Promise<UserCheckOutDTO[]> {
    return this.ucoService.getCheckedOutConfigurations();
  }

  @Post(':planId')
  @RoleGuard({ pathParam: 'planId' }, LookupType.MonitorPlan)
  @ApiOkResponse({
    type: UserCheckOutBaseDTO,
    description: 'Checks Out a Monitor Plan configuration',
  })
  checkOutConfiguration(
    @Param('planId') planId: string,
    @User() user: CurrentUser,
  ): Promise<UserCheckOutDTO> {
    const result = this.ucoService.checkOutConfiguration(planId, user.userId);
    return result;
  }

  @Put(':planId')
  @RoleGuard({ pathParam: 'planId' }, LookupType.MonitorPlan)
  @ApiOkResponse({
    type: UserCheckOutBaseDTO,
    description: 'Updates last activity for a checked out Monitor Plan',
  })
  updateLastActivity(
    @Param('planId') planId: string,
  ): Promise<UserCheckOutDTO> {
    return this.ucoService.updateLastActivity(planId);
  }

  @Delete(':planId')
  @RoleGuard({ pathParam: 'planId' }, LookupType.MonitorPlan)
  @ApiOkResponse({
    description: 'Check-In a Monitor Plan configuration',
  })
  async checkInConfiguration(
    @Param('planId') planId: string,
    @User() user: CurrentUser,
  ) {
    const result = await this.ucoService.getCheckedOutConfiguration(planId);
    if (result && (await this.ucoService.checkInConfiguration(planId))) {
      await this.mpWksService.updateDateAndUserId(planId, user.userId);
    }
  }
}
