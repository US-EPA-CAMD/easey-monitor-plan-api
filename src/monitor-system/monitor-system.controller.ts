import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

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
  async getSystems(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorSystemDTO>> {
    const systems = await this.service.getSystems(locationId);

    return  {
      items: systems
    }
  }
}
