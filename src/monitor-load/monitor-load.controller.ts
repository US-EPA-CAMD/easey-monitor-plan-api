import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadService } from './monitor-load.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Loads')
export class MonitorLoadController {
  constructor(private service: MonitorLoadService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Retrieves official load records for a monitor location',
  })
  getLoads(@Param('locId') locationId: string): Promise<MonitorLoadDTO[]> {
    return this.service.getLoads(locationId);
  }
}
