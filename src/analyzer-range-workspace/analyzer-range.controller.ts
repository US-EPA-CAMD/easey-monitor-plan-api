import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateAnalyzerRangeDTO } from '../dtos/update-analyzer-range.dto';
import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';

@ApiTags('Analyzer Ranges')
@Controller()
export class AnalyzerRangeWorkspacController {
  constructor(private service: AnalyzerRangeWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AnalyzerRangeDTO,
    description: 'Retrieves workspace Analyzer Range records for a component',
  })
  getAnalyzerRanges(
    @Param('locId') locId: string,
    @Param('compId') compId: string,
  ): Promise<AnalyzerRangeDTO[]> {
    return this.service.getAnalyzerRanges(compId);
  }

  @Put(':analyzerRangeId')
  @ApiOkResponse({
    isArray: false,
    type: AnalyzerRangeDTO,
    description: 'Updates workspace Analyzer Range record for a component',
  })
  updateAnalyserRange(
    @Param('locId') locId: string,
    @Param('compId') compId: string,
    @Param('analyzerRangeId') analyzerRangeId: string,
    @Body() payload: UpdateAnalyzerRangeDTO,
  ) {
    return this.service.updateAnalyzerRangd(analyzerRangeId, payload);
  }
}
