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
      'Retrieves workspace reporting frequency records from a specific unit ID',
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
