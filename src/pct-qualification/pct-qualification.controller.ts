import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationService } from './pct-qualification.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('PCT Qualifications')
@ApiExtraModels(PCTQualificationDTO)
export class PCTQualificationController {
  constructor(private readonly service: PCTQualificationService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official pct qualification records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(PCTQualificationDTO) },
              },
            },
          },
        },
      }
  })
  async getPCTQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<ArrayResponse<PCTQualificationDTO>> {
    const pctQualifications = await this.service.getPCTQualifications(qualificationId);

    return  {
      items: pctQualifications
    }
  }
}
