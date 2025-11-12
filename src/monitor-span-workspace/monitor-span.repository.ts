import { Injectable } from '@nestjs/common';
import { EntityManager, IsNull, Repository } from 'typeorm';

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

  async getSpanByLogicalKey(
    locationId: string,
    componentTypeCode: string,
    spanScaleCode: string,
    beginDate: Date,
    beginHour: number,
  ): Promise<MonitorSpan | null> {
    const query = this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.componentTypeCode = :componentTypeCode', {
        componentTypeCode,
      })
      .andWhere('ms.beginDate = :beginDate', { beginDate })
      .andWhere('ms.beginHour = :beginHour', { beginHour })

    if (spanScaleCode === null || spanScaleCode === undefined) {
      query.andWhere('ms.spanScaleCode IS NULL');
    } else {
      query.andWhere('ms.spanScaleCode = :spanScaleCode', { spanScaleCode });
    }

    return query.getOne();
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
