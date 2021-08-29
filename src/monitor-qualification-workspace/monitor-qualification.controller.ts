import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';

@ApiTags('Qualifications')
@Controller()
export class MonitorQualificationWorkspaceController {
  constructor(private readonly service: MonitorQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorQualificationDTO,
    description:
      'Retrieves workspace qualification records for a monitor location',
  })
  getQualifications(
    @Param('locId') locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    return this.service.getQualifications(locationId);
  }
}
