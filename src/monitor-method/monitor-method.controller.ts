import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodService } from './monitor-method.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Methods')
export class MonitorMethodController {
  constructor(private service: MonitorMethodService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorMethodDTO,
    description: 'Retrieves official method records for a monitor location',
  })
  getMethods(@Param('locId') locationId: string): Promise<MonitorMethodDTO[]> {
    return this.service.getMethods(locationId);
  }
}
