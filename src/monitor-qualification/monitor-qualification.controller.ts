import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationService } from './monitor-qualification.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Qualifications')
@ApiExtraModels(MonitorQualificationDTO)
export class MonitorQualificationController {
  constructor(private readonly service: MonitorQualificationService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official qualification records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorQualificationDTO) },
              },
            },
          },
        },
      }
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
