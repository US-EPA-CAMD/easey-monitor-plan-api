import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationService } from './lee-qualification.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LEE Qualifications')
@ApiExtraModels(LEEQualificationDTO)
export class LEEQualificationController {
  constructor(private readonly service: LEEQualificationService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official lee qualification records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(LEEQualificationDTO) },
              },
            },
          },
        },
      }
  })
  async getLEEQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<ArrayResponse<LEEQualificationDTO>> {
    const lEEQualifications = await this.service.getLEEQualifications(qualificationId);

    return  {
      items: lEEQualifications
    };
  }
}
