import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuditLog, RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { MonitorPlanReportingFrequencyWorkspaceService } from './monitor-plan-reporting-freq.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Reporting Frequencies')
@ApiExcludeControllerByEnv()
@ApiExtraModels(ReportingFreqDTO)
export class MonitorPlanReportingFrequencyWorkspaceController {
  constructor(
    private readonly service: MonitorPlanReportingFrequencyWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace reporting frequency records for a specific plan ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(ReportingFreqDTO) },
              },
            },
          },
        },
      }
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'planId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.MonitorPlan,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor plan reporting frequencies',
    requestParamsOutFields: ['planId']
  })
  async getReportingFreqs(
    @Param('planId') planId: string,
  ): Promise<ArrayResponse<ReportingFreqDTO>> {
    const reportingFreqDTOS = await this.service.getReportingFreqs(planId);

    return {
      items: reportingFreqDTOS
    };
  }
}
