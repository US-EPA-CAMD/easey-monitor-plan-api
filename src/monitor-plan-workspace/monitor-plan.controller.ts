import {
  Get,
  Param,
  Controller,
  ParseIntPipe,
  Post,
  Put,
  Body,
  Delete,
} from '@nestjs/common';

import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { UserCheckOut } from '../entities/workspace/user-check-out.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { UserCheckOutDTO } from 'src/dtos/user-check-out.dto';

@ApiTags('Monitor Plan')
@Controller()
export class MonitorPlanWorkspaceController {
  constructor(private service: MonitorPlanWorkspaceService) {}

  @Get('/:orisCode/configurations')
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

  @Post('/:id/check-out')
  @ApiOkResponse({
    type: UserCheckOut,
    description: 'Checks Out a Monitor Plan configuration',
  })
  checkOutConfiguration(
    @Param('id') id: string,
    @Body() payload: UserCheckOutDTO,
  ): Promise<UserCheckOut> {
    return this.service.checkOutConfiguration(id, payload.username);
  }

  @Put('/:id/check-out')
  @ApiOkResponse({
    type: UserCheckOut,
    description: 'Updates last activity for a checked out Monitor Plan',
  })
  updateLastActivity(@Param('id') id: string): Promise<UserCheckOut> {
    return this.service.updateLastActivity(id);
  }

  @Delete('/:id/check-in')
  @ApiOkResponse({
    description: 'Check-In a Monitor Plan configuration',
  })
  checkInConfiguration(@Param('id') id: string): Promise<void> {
    return this.service.checkInConfiguration(id);
  }
}
