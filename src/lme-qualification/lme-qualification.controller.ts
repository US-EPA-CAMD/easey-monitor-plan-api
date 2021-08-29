import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationService } from './lme-qualification.service';

@ApiTags('LME Qualifications')
@Controller()
export class LMEQualificationController {
  constructor(private readonly service: LMEQualificationService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LMEQualificationDTO,
    description:
      'Retrieves official lme qualification records for a monitor location',
  })
  getLMEQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<LMEQualificationDTO[]> {
    return this.service.getLMEQualifications(qualificationId);
  }
}
