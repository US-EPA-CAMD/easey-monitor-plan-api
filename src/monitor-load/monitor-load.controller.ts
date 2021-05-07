import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Get, Param, Controller } from '@nestjs/common';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadService } from './monitor-load.service';

@ApiTags('Monitor Loads')
@Controller()
export class MonitorLoadController {
  constructor(private service: MonitorLoadService) {}

  @Get('/monitor-locations/:id/loads')
  @ApiOkResponse({
    description: 'Retrieved Methods',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Request',
  })
  @ApiNotFoundResponse({
    description: 'Resource Not Found',
  })
  getUnits(@Param('id') monLocId: string): Promise<MonitorLoadDTO[]> {
    return this.service.getMonitorLoads(monLocId);
  }
}
