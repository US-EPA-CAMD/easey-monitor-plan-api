import { AnalyzerRangeBaseDTO } from 'src/dtos/analyzer-range.dto';
import { EntityRepository, Repository } from 'typeorm';

import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';

@EntityRepository(AnalyzerRange)
export class AnalyzerRangeWorkspaceRepository extends Repository<
  AnalyzerRange
> {
  async getAnalyzerRangeByComponentIdAndDate(
    componentId: string,
    analyzerRange: AnalyzerRangeBaseDTO,
  ): Promise<AnalyzerRange> {
    const beginDate = analyzerRange.beginDate;
    const beginHour = analyzerRange.beginHour;
    const endDate = analyzerRange.endDate;
    const endHour = analyzerRange.endHour;

    return this.createQueryBuilder('ar')
      .where('ar.componentRecordId = :componentId', {
        componentId,
      })
      .andWhere(
        '(ar.beginDate = :beginDate AND ar.beginHour = :beginHour) OR (ar.endDate = :endDate AND ar.endHour = :endHour)',
        {
          beginDate,
          beginHour,
          endDate,
          endHour,
        },
      )
      .getOne();
  }
}
