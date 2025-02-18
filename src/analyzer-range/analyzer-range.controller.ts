import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeService } from './analyzer-range.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Analyzer Ranges')
export class AnalyzerRangeController {
  constructor(private readonly service: AnalyzerRangeService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AnalyzerRangeDTO,
    description: 'Retrieves official analyzer range records for a component',
  })
  async getAnalyzerRanges(
    @Param('locId') locId: string,
    @Param('compId') compId: string,
  ): Promise<ArrayResponse<AnalyzerRangeDTO>> {
    const analyzerRanges = await this.service.getAnalyzerRanges(compId);

    return  {
      items: analyzerRanges
    };
  }
}
