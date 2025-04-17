import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { AuditLog, RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { MonitorPlanReportingFrequencyWorkspaceService } from './monitor-plan-reporting-freq.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';

const ArrayResponseReportingFreqDTO = createArrayResponseDto(ReportingFreqDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Reporting Frequencies')
@ApiExcludeControllerByEnv()
export class MonitorPlanReportingFrequencyWorkspaceController {
  constructor(
    private readonly service: MonitorPlanReportingFrequencyWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseReportingFreqDTO,
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
  @AuditLog({
    label: 'Retrieved workspace monitor location unit reporting frequencies',
    requestParamsOutFields: ['unitId']
  })
  async getReportingFreqs(
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<ReportingFreqDTO>> {
    const reportingFreqDTOS = await this.service.getReportingFreqs(unitId);

    return  {
      items: reportingFreqDTOS
    };
  }
}
