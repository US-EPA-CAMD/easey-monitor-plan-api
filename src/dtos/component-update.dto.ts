import { UpdateAnalyzerRangeDTO } from './analyzer-range-update.dto';
import { ComponentBaseDTO } from './component-base.dto';

export class UpdateComponentDTO extends ComponentBaseDTO {
  analyzerRanges: UpdateAnalyzerRangeDTO[];
}
