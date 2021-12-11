import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultService } from './monitor-default.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Defaults')
export class MonitorDefaultController {
  constructor(private readonly service: MonitorDefaultService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorDefaultDTO,
    description: 'Retrieves official default records for a monitor location',
  })
  getDefaults(
    @Param('locId') locationId: string,
  ): Promise<MonitorDefaultDTO[]> {
    return this.service.getDefaults(locationId);
  }
}
