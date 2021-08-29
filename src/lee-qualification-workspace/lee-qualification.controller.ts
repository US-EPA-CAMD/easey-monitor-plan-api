import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';

@ApiTags('LEE Qualifications')
@Controller()
export class LEEQualificationWorkspaceController {
  constructor(private readonly service: LEEQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LEEQualificationDTO,
    description:
      'Retrieves workspace lee qualification records for a monitor location',
  })
  getLEEQualifications(
    @Param('locId') locationId: string,
    @Param('qualId') qualificationId: string,
  ): Promise<LEEQualificationDTO[]> {
    return this.service.getLEEQualifications(qualificationId);
  }
}
