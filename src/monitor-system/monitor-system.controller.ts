import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Systems')
export class MonitorSystemController {
  constructor(private service: MonitorSystemService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSystemDTO,
    description: 'Retrieves official system records for a monitor location',
  })
  getSystems(@Param('locId') locationId: string): Promise<MonitorSystemDTO[]> {
    return this.service.getSystems(locationId);
  }
}
