import { UserCheckOutDTO } from './../dtos/user-check-out.dto';
import {
  Get,
  Param,
  Controller,
  ParseIntPipe,
  Post,
  Body,
  Put,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserCheckOut } from 'src/entities/user-check-out.entity';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanService } from './monitor-plan.service';

@ApiTags('Monitor Plan')
@Controller()
export class MonitorPlanController {
  constructor(private service: MonitorPlanService) {}

  @Get('/:orisCode/configurations')
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanDTO,
    description: 'Retrieved Monitor Plans',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
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
  checkOutPlanConfiguration(
    @Param('id') id: string,
    @Body() payload: UserCheckOutDTO,
  ): Promise<UserCheckOut> {
    return this.service.getUserCheckOut(id, payload.username);
  }

  @Put('/:id/check-out')
  @ApiOkResponse({
    type: UserCheckOut,
    description: 'Updates last activity for a checked out Monitor Plan',
  })
  updateLockActivity(@Param('id') id: string): Promise<UserCheckOut> {
    return this.service.updateLockActivity(id);
  }
}
