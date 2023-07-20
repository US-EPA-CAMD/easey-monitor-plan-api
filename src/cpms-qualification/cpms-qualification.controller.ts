import { Controller, Get, Param } from '@nestjs/common';
import { CPMSQualificationService } from './cpms-qualification.service';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('CPMS Qualifications')
export class CPMSQualificationController {
  constructor(private readonly service: CPMSQualificationService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: CPMSQualificationDTO,
    description:
      'Retrieves workspace cpms qualification records for a monitor location',
  })
  getCPMSQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<CPMSQualificationDTO[]> {
    return this.service.getCPMSQualifications(locId, qualId);
  }
}
