import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationService } from './lee-qualification.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseLEEQualificationDTO = createArrayResponseDto(LEEQualificationDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LEE Qualifications')
export class LEEQualificationController {
  constructor(private readonly service: LEEQualificationService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseLEEQualificationDTO,
    description:
      'Retrieves official lee qualification records for a monitor location',
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
