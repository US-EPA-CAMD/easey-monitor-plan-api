import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Get, Param, Controller, Put, Post, Body } from '@nestjs/common';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodService } from './monitor-method.service';

@ApiTags('Monitor Methods')
@Controller()
export class MonitorMethodController {
  constructor(private service: MonitorMethodService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieved Methods',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getMethods(@Param('id') monLocId: string): Promise<MonitorMethodDTO[]> {
    return this.service.getMethods(monLocId);
  }

  @Get(':/locId/methods')
  @ApiOkResponse({
    description: 'Retrieves Monitor Locations Methods',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getMonitorLocationMethods(@Param('locId') locId: string) {}

  @Post('/:locId/methods')
  @ApiOkResponse({
    description: 'Adds a Monitor Locations Method',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  addMonitorLocationMethods(
    @Param('locId') locId: string,
    @Body() createMonitorMethodDTO: MonitorMethodDTO,
  ) {}

  @Put('/:locId/methods')
  @ApiOkResponse({
    description: 'Updates Monitor Locations Method',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  updateMonitorLocationMethods(
    @Param('locId') locId: string,
    @Body() monintorMethodDTO: MonitorMethodDTO,
  ) {}
}
