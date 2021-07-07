import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadService } from './monitor-load.service';

@ApiTags('Loads')
@Controller()
export class MonitorLoadController {
  constructor(private service: MonitorLoadService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Retrieves official load records for a monitor location',
  })
  getLoads(@Param('locId') monLocId: string): Promise<MonitorLoadDTO[]> {
    return this.service.getLoads(monLocId);
  }
}
