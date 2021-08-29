import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';

@ApiTags('PCT Qualifications')
@Controller()
export class PCTQualificationWorkspaceController {
  constructor(private readonly service: PCTQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: PCTQualificationDTO,
    description:
      'Retrieves workspace pct qualification records for a monitor location',
  })
  getPCTQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<PCTQualificationDTO[]> {
    return this.service.getPCTQualifications(qualificationId);
  }
}
