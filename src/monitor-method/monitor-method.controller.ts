import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodService } from './monitor-method.service';

@ApiTags('Methods')
@Controller()
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
