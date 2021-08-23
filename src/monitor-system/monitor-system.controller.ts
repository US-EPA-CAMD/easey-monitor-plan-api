import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';

@ApiTags('Systems')
@Controller()
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
