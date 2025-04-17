import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadService } from './monitor-load.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseMonitorLoadDTO = createArrayResponseDto(MonitorLoadDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Loads')
export class MonitorLoadController {
  constructor(private service: MonitorLoadService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseMonitorLoadDTO,
    description: 'Retrieves official load records for a monitor location',
  })
  async getLoads(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorLoadDTO>> {
    const loads = await this.service.getLoads(locationId);

    return  {
      items: loads
    }
  }
}
