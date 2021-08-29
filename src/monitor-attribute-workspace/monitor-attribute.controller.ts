import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';

@ApiTags('Attributes')
@Controller()
export class MonitorAttributeWorkspaceController {
  constructor(private readonly service: MonitorAttributeWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorAttributeDTO,
    description: 'Retrieves workspace attribute records for a monitor location',
  })
  getAttributes(
    @Param('locId') locationId: string,
  ): Promise<MonitorAttributeDTO[]> {
    return this.service.getAttributes(locationId);
  }
}
