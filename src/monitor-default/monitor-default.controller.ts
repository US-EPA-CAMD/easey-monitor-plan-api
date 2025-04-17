import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultService } from './monitor-default.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseMonitorDefaultDTO = createArrayResponseDto(MonitorDefaultDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Defaults')
export class MonitorDefaultController {
  constructor(private readonly service: MonitorDefaultService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseMonitorDefaultDTO,
    description: 'Retrieves official default records for a monitor location',
  })
  async getDefaults(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorDefaultDTO>> {
    const defaults = await this.service.getDefaults(locationId);

    return  {
      items: defaults
    };
  }
}
