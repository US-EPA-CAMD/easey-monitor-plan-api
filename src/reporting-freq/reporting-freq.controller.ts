import { Controller, Get, Param} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { ReportingFreqService } from './reporting-freq.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Reporting Frequencies')
export class ReportingFreqController {
  constructor(private readonly service: ReportingFreqService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ReportingFreqDTO,
    description:
      'Retrieves reporting frequency records from a specific unit ID',
  })
  getReportingFreqs(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<ReportingFreqDTO[]> {
    return this.service.getReportingFreqs(locId, unitId);
  }
}
