import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { MonitorPlanReportingFrequencyService } from './monitor-plan-reporting-freq.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Reporting Frequencies')
@ApiExtraModels(ReportingFreqDTO)
export class MonitorPlanReportingFrequencyController {
  constructor(private readonly service: MonitorPlanReportingFrequencyService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves reporting frequency records from a specific unit ID',
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
  async getReportingFreqs(
    @Param('unitId') unitRecordId: number,
  ): Promise<ArrayResponse<ReportingFreqDTO>> {

    const reportingFreqDTOS = await this.service.getReportingFreqs(unitRecordId);

    return  {
      items: reportingFreqDTOS
    };
  }
}
