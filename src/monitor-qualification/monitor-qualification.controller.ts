import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationService } from './monitor-qualification.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Qualifications')
export class MonitorQualificationController {
  constructor(private readonly service: MonitorQualificationService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorQualificationDTO,
    description:
      'Retrieves official qualification records for a monitor location',
  })
  async getQualifications(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorQualificationDTO>> {
    const qualifications = await this.service.getQualifications(locationId);

    return  {
      items: qualifications
    }
  }
}
