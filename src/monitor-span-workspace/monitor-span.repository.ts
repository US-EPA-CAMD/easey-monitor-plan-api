import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorSpan } from '../entities/workspace/monitor-span.entity';

@Injectable()
export class MonitorSpanWorkspaceRepository extends Repository<MonitorSpan> {
  constructor(entityManager: EntityManager) {
    super(MonitorSpan, entityManager);
  }

  async getSpan(locationId: string, id: string): Promise<MonitorSpan> {
    return this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.id = :id ', { id })
      .getOne();
  }

  async getSpanByLocIdCompTypeCdBeginOrEndDate(
    locationId: string,
    componentTypeCode: string,
    spanScaleCode: string,
    beginDate: Date,
    beginHour: number,
    endDate: Date | null,
    endHour: number | null,
  ): Promise<MonitorSpan | null> {
    const query = this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.componentTypeCode = :componentTypeCode', { componentTypeCode });

    if (spanScaleCode) {
      query.andWhere('ms.spanScaleCode = :spanScaleCode', { spanScaleCode });
    }

    query.andWhere(
      '(ms.beginDate = :beginDate AND ms.beginHour = :beginHour)',
      { beginDate, beginHour },
    );

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null && endHour !== null) {
      const endQuery = this.createQueryBuilder('ms')
        .where('ms.locationId = :locationId', { locationId })
        .andWhere('ms.componentTypeCode = :componentTypeCode', { componentTypeCode });

      if (spanScaleCode) {
        endQuery.andWhere('ms.spanScaleCode = :spanScaleCode', { spanScaleCode });
      }

      endQuery.andWhere(
        '(ms.endDate = :endDate AND ms.endHour = :endHour)',
        { endDate, endHour },
      );

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }


  async getSpanByLocIdCompTypeCdEDateEHour(
    locationId: string,
    componentTypeCode: string,
    endDate: Date,
    endHour: number,
  ): Promise<MonitorSpan> {
    return this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.componentTypeCode = :componentTypeCode', {
        componentTypeCode,
      })
      .andWhere('ms.endDate = :endDate', { endDate })
      .andWhere('ms.endHour = :endHour', { endHour })
      .getOne();
  }

  async getSpanByFilter(
    locationId: string | null,
    componentTypeCode: string,
    beginDate?: Date,
    beginHour?: number,
    endDate?: Date,
    endHour?: number,
    spanScaleCode?: string,
  ) {
    if (!locationId) return null;

    const query = this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.componentTypeCode = :componentTypeCode', {
        componentTypeCode,
      });

    if (beginDate) query.andWhere('ms.beginDate = :beginDate', { beginDate });
    if (beginHour) query.andWhere('ms.beginHour = :beginHour', { beginHour });
    if (endDate) query.andWhere('ms.endDate = :endDate', { endDate });
    if (endHour) query.andWhere('ms.endHour = :endHour', { endHour });
    if (spanScaleCode)
      query.andWhere('ms.spanScaleCode = :spanScaleCode', { spanScaleCode });

    return query.getOne();
  }
}
