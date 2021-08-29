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
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';

import { UserDTO } from '../dtos/user.dto';
import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';

import { CurrentUser } from './../decorators/current-user.decorator';

@ApiTags('Plans & Configurations')
@Controller()
export class MonitorPlanWorkspaceController {
  constructor(
    private service: MonitorPlanWorkspaceService,
    private ucoService: UserCheckOutService,
  ) {}

  @Get('/:id')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'Retrieves workspace Monitor Plan record',
  })
  getMonitorPlan(@Param('id') monPlanId: string): Promise<MonitorPlanDTO> {
    return this.service.getMonitorPlan(monPlanId);
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

  @Post('import')
  @ApiOkResponse({
    type: MonitorPlanDTO,
    description: 'imports an entire monitor plan from JSON payload',
  })
  importPlan(@Body() plan: UpdateMonitorPlanDTO): Promise<MonitorPlanDTO> {
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

  @Post(':id/check-outs')
  @ApiOkResponse({
    type: UserCheckOutDTO,
    description: 'Checks Out a Monitor Plan configuration',
  })
  checkOutConfiguration(
    @Param('id') id: string,
    @Body() payload: UserDTO,
    @CurrentUser() user: UserDTO,
  ): Promise<UserCheckOutDTO> {
    return this.ucoService.checkOutConfiguration(id, user.id);
  }

  @Put(':id/check-outs')
  @ApiOkResponse({
    type: UserCheckOutDTO,
    description: 'Updates last activity for a checked out Monitor Plan',
  })
  updateLastActivity(@Param('id') id: string): Promise<UserCheckOutDTO> {
    return this.ucoService.updateLastActivity(id);
  }

  @Delete(':id/check-outs')
  @ApiOkResponse({
    description: 'Check-In a Monitor Plan configuration',
  })
  checkInConfiguration(@Param('id') id: string): Promise<void> {
    return this.ucoService.checkInConfiguration(id);
  }

  @Delete(':id/revert')
  @ApiOkResponse({
    description:
      'Revert workspace monitor plan back to official submitted record',
  })
  revertToOfficialRecord(@Param('id') id: string): Promise<void> {
    return this.service.revertToOfficialRecord(id);
  }
}
