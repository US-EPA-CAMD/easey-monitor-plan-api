import { AnalyzerRangeBaseDTO } from './analyzer-range-base.dto';

export class AnalyzerRangeDTO extends AnalyzerRangeBaseDTO {
  id: string;
  componentRecordId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
