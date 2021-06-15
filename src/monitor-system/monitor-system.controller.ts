import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Get, Param, Controller } from '@nestjs/common';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemService } from './monitor-system.service';
import { ComponentDTO } from '../dtos/component.dto';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';

@ApiTags('Systems')
@Controller()
export class MonitorSystemController {
  constructor(private service: MonitorSystemService) {}

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
  getSystems(@Param('id') monLocId: string): Promise<MonitorSystemDTO[]> {
    return this.service.getSystems(monLocId);
  }

  @Get(':id/components')
  @ApiOkResponse({
    description: 'Retrieved Methods',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getSystemComponents(@Param('id') systemId: string): Promise<ComponentDTO[]> {
    return this.service.getComponents(systemId);
  }

  @Get(':id/system-fuel-flows')
  @ApiOkResponse({
    description: 'Retrieved Methods',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getSystemFuelFlows(
    @Param('id') systemId: string,
  ): Promise<SystemFuelFlowDTO[]> {
    return this.service.getSysFuelFlow(systemId);
  }
}
