import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeService } from './analyzer-range.service';

@ApiTags('Analyzer Ranges')
@Controller()
export class AnalyzerRangeController {
  constructor(private service: AnalyzerRangeService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AnalyzerRangeDTO,
    description: 'Retrieves official analyzer range records for a component',
  })
  getAnalyzerRanges(
    @Param('locId') locId: string,
    @Param('compId') compId: string,
  ): Promise<AnalyzerRangeDTO[]> {
    return this.service.getAnalyzerRanges(compId);
  }
}
