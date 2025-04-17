import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationService } from './lme-qualification.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';

const ArrayResponseLMEQualificationDTO = createArrayResponseDto(LMEQualificationDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LME Qualifications')
export class LMEQualificationController {
  constructor(private readonly service: LMEQualificationService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseLMEQualificationDTO,
    description:
      'Retrieves official lme qualification records for a monitor location',
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
