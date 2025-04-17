import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationService } from './pct-qualification.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponsePCTQualificationDTO = createArrayResponseDto(PCTQualificationDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('PCT Qualifications')
export class PCTQualificationController {
  constructor(private readonly service: PCTQualificationService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponsePCTQualificationDTO,
    description:
      'Retrieves official pct qualification records for a monitor location',
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
