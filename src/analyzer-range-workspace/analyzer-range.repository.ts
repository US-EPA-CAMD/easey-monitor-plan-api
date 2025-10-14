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

  async getAnalyzerRangeByComponentIdBeginOrEndDate(
    componentId: string,
    analyzerRange: AnalyzerRangeBaseDTO,
  ): Promise<AnalyzerRange | null> {
    const beginDate = analyzerRange.beginDate;
    const beginHour = analyzerRange.beginHour;
    const endDate = analyzerRange.endDate;
    const endHour = analyzerRange.endHour;

    const query = this.createQueryBuilder('ar')
      .innerJoin('ar.component', 'c')
      .where('c.id = :componentId', { componentId })
      .andWhere('(ar.beginDate = :beginDate AND ar.beginHour = :beginHour)', {
        beginDate,
        beginHour,
      });

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null && endHour !== null) {
      const endQuery = this.createQueryBuilder('ar')
        .innerJoin('ar.component', 'c')
        .where('c.id = :componentId', { componentId })
        .andWhere('(ar.endDate = :endDate AND ar.endHour = :endHour)', {
          endDate,
          endHour,
        });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }

  async getAnalyzerRangeByLogicalKey(
    componentId: string,
    beginDate: Date,
    beginHour: number,
  ): Promise<AnalyzerRange | null> {
    return this.createQueryBuilder('ar')
      .where('ar.componentRecordId = :componentId', { componentId })
      .andWhere('ar.beginDate = :beginDate', { beginDate })
      .andWhere('ar.beginHour = :beginHour', { beginHour })
      .getOne();
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
