import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationService } from './pct-qualification.service';

@ApiTags('PCT Qualifications')
@Controller()
export class PCTQualificationController {
  constructor(private readonly service: PCTQualificationService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: PCTQualificationDTO,
    description:
      'Retrieves official pct qualification records for a monitor location',
  })
  getPCTQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<PCTQualificationDTO[]> {
    return this.service.getPCTQualifications(qualificationId);
  }
}
