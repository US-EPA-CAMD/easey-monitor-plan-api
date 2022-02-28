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
  ApiBearerAuth,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
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
    private readonly logger: Logger,
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

  @Put(':planId')
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

  @Delete(':planId')
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
        returnVal = this.mpWksService.updateDateAndUserId(planId, userId);
        this.logger.info(
          'updated update date and user id for closed/checked-in plan.',
        );
      }
    });

    return returnVal;
  }
}
