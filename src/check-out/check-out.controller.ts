import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  UserCheckOutBaseDTO,
  UserCheckOutDTO,
} from '../dtos/user-check-out.dto';
import { CheckOutService } from './check-out.service';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Check-Outs')
export class CheckOutController {
  constructor(
    private readonly service: CheckOutService,
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: UserCheckOutBaseDTO,
    description: 'Checks Out a Monitor Plan configuration',
  })
  checkOutConfiguration(
    @Param('planId') planId: string,
    @User() user: CurrentUser,
  ): Promise<UserCheckOutDTO> {
    return this.ucoService.checkOutConfiguration(planId, user.userId);
  }

  @Put(':planId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Check-In a Monitor Plan configuration',
  })
  checkInConfiguration(
    @Param('planId') planId: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    let returnVal: any;

    this.ucoService.checkInConfiguration(planId).then(res => {
      if (res) {
        returnVal = this.mpWksService.updateDateAndUserId(planId, user.userId);
      }
    });

    return returnVal;
  }
}
