import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationService } from './lme-qualification.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LME Qualifications')
@ApiExtraModels(LMEQualificationDTO)
export class LMEQualificationController {
  constructor(private readonly service: LMEQualificationService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official lme qualification records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(LMEQualificationDTO) },
              },
            },
          },
        },
      }
  })
  async getLMEQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<ArrayResponse<LMEQualificationDTO>> {
    const lMEQualifications = await this.service.getLMEQualifications(qualificationId);

    return  {
      items: lMEQualifications
    };
  }
}
