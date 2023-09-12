import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AnalyzerRange } from '../entities/analyzer-range.entity';
import { AnalyzerRange as WorkspaceAnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';

@Injectable()
export class AnalyzerRangeMap extends BaseMap<
  AnalyzerRange | WorkspaceAnalyzerRange,
  AnalyzerRangeDTO
> {
  public async one(
    entity: AnalyzerRange | WorkspaceAnalyzerRange,
  ): Promise<AnalyzerRangeDTO> {
    return {
      id: entity.id,
      componentRecordId: entity.componentRecordId,
      analyzerRangeCode: entity.analyzerRangeCode,
      dualRangeIndicator: entity.dualRangeIndicator,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      beginHour: entity.beginHour,
      endHour: entity.endHour,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
