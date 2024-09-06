import { Controller, Get, Param} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { ReportingFreqWorkspaceService } from './reporting-freq.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Reporting Frequencies')
export class ReportingFreqWorkspaceController {
  constructor(private readonly service: ReportingFreqWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ReportingFreqDTO,
    description:
      'Retrieves workspace reporting frequency records from a specific unit ID',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getReportingFreqs(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<ReportingFreqDTO[]> {
    return this.service.getReportingFreqs(locId, unitId);
  }
}
