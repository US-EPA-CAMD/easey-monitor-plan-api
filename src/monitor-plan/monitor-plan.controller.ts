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
    description: 'Checks Out a Monitor Plan configuration',
  })
  checkOutPlanConfiguration(
    @Param('id') id: string,
    @Body('username') username: string,
  ): Promise<UserCheckOut> {
    return this.service.getUserCheckOut(id, username);
  }

  @Put('/:id/check-out')
  @ApiOkResponse({
    description: 'Updates the lock expiration by 15 mins',
  })
  updateUserCheckOut(@Param('id') id: string): Promise<UserCheckOut> {
    return this.service.updateLockExpiration(id);
  }
}
