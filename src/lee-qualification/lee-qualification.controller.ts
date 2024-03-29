import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationService } from './lee-qualification.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('LEE Qualifications')
export class LEEQualificationController {
  constructor(private readonly service: LEEQualificationService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LEEQualificationDTO,
    description:
      'Retrieves official lee qualification records for a monitor location',
  })
  getLEEQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<LEEQualificationDTO[]> {
    return this.service.getLEEQualifications(qualificationId);
  }
}
