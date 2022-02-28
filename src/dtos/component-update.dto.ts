import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { AnalyzerRangeBaseDTO } from './analyzer-range-base.dto';
import { UpdateAnalyzerRangeDTO } from './analyzer-range-update.dto';
import { ComponentBaseDTO } from './component-base.dto';

export class UpdateComponentDTO extends ComponentBaseDTO {
  @ValidateNested()
  @Type(() => UpdateAnalyzerRangeDTO)
  analyzerRanges: UpdateAnalyzerRangeDTO[];
}
