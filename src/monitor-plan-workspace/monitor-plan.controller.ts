import {
  Get,
  Param,
  Controller,
  ParseIntPipe,
  Post,
  Body,
  Put,
} from '@nestjs/common';

import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOut } from '../entities/workspace/user-check-out.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';

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
}
