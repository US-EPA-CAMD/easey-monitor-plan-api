import { Controller, Get, Param } from '@nestjs/common';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import { ApiTags, ApiSecurity, ApiOkResponse } from '@nestjs/swagger';
import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';
import { RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('CPMS Qualifications')
export class CPMSQualificationWorkspaceController {
  constructor(private readonly service: CPMSQualificationWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: CPMSQualificationDTO,
    description:
      'Retrieves workspace cpms qualification records for a monitor location',
  })
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
  getCPMSQualifications(
    @Param('locId') locId: string,
    @Param('qualId') qualId: string,
  ): Promise<CPMSQualificationDTO[]> {
    return this.service.getCPMSQualifications(locId, qualId);
  }
}
