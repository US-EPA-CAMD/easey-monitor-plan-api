import { ComponentBaseDTO } from './component-base.dto';
import { AnalyzerRangeDTO } from './analyzer-range.dto';

export class ComponentDTO extends ComponentBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  analyzerRanges: AnalyzerRangeDTO[];
}
