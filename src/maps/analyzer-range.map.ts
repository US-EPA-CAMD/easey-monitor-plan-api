import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { AnalyzerRange } from '../entities/analyzer-range.entity';
import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';

@Injectable()
export class AnalyzerRangeMap extends BaseMap<AnalyzerRange, AnalyzerRangeDTO> {
  public async one(entity: AnalyzerRange): Promise<AnalyzerRangeDTO> {
    return {
      id: entity.id,
      componentId: entity.componentId,
      analyzerRangeCode: entity.analyzerRangeCode,
      dualRangeIndicator: entity.dualRangeIndicator,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      beginHour: entity.beginHour,
      endHour: entity.endHour,
      active: entity.endDate === null,
    };
  }
}
