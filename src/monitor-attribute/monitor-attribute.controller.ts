import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeService } from './monitor-attribute.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Attributes')
export class MonitorAttributeController {
  constructor(private readonly service: MonitorAttributeService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorAttributeDTO,
    description: 'Retrieves official attribute records for a monitor location',
  })
  async getAttributes(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorAttributeDTO>> {
    const attributes = await this.service.getAttributes(locationId);

    return  {
      items: attributes
    };
  }
}
