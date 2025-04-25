import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { MonitorPlanReportingFrequencyService } from './monitor-plan-reporting-freq.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Reporting Frequencies')
export class MonitorPlanReportingFrequencyController {
  constructor(private readonly service: MonitorPlanReportingFrequencyService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ReportingFreqDTO,
    description:
      'Retrieves reporting frequency records from a specific unit ID',
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
