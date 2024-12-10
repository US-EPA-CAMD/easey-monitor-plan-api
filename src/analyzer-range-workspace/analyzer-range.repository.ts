import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AnalyzerRangeBaseDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';

@Injectable()
export class AnalyzerRangeWorkspaceRepository extends Repository<
  AnalyzerRange
> {
  constructor(entityManager: EntityManager) {
    super(AnalyzerRange, entityManager);
  }

  async getAnalyzerRangeByComponentIdAndDate(
    componentId: string,
    analyzerRange: AnalyzerRangeBaseDTO,
  ): Promise<AnalyzerRange> {
    const beginDate = analyzerRange.beginDate;
    const beginHour = analyzerRange.beginHour;
    const endDate = analyzerRange.endDate;
    const endHour = analyzerRange.endHour;

    const query = this.createQueryBuilder('ar')
      .innerJoin('ar.component', 'c')
      .where('c.id = :componentId', {
        componentId,
      })
      .andWhere(
        `(ar.beginDate = :beginDate AND ar.beginHour = :beginHour)`,
        { beginDate, beginHour }
      )

      if (endDate !== null && endHour !== null) {
        query.andWhere(
          '(ar.endDate = :endDate AND ar.endHour = :endHour)',
          { endDate, endHour }
        );
      } else {
        query.andWhere('ar.endDate IS NULL AND ar.endHour IS NULL');
      }

    return query.getOne();
  }

  async getAnalyzerRangesByCompIds(
    componentIds: string[],
  ): Promise<AnalyzerRange[]> {
    return this.createQueryBuilder('ar')
      .innerJoinAndSelect('ar.component', 'c')
      .where('c.id IN (:...componentIds)', { componentIds })
      .getMany();
  }
}
