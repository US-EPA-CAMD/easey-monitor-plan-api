import { Repository, EntityRepository } from 'typeorm';

import { MonitorSpan } from '../entities/workspace/monitor-span.entity';
import { MonitorSpanBaseDTO } from '../dtos/monitor-span.dto';

@EntityRepository(MonitorSpan)
export class MonitorSpanWorkspaceRepository extends Repository<MonitorSpan> {
  async getSpan(locationId: string, id: string): Promise<MonitorSpan> {
    return this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.id = :id ', { id })
      .getOne();
  }

  async getSpanByLocIdCompTypeCdBDateBHour(
    locationId: string,
    componentTypeCode: string,
    spanScaleCode: string,
    beginDate: Date,
    beginHour: number,
    endDate: Date,
    endHour: number,
  ): Promise<MonitorSpan> {
    const query = this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.componentTypeCode = :componentTypeCode', {
        componentTypeCode,
      })
      .andWhere('ms.beginDate = :beginDate AND ms.beginHour = :beginHour', {
        beginDate,
        beginHour,
      });

    if (spanScaleCode) {
      query.andWhere('ms.spanScaleCode = :spanScaleCode', {
        spanScaleCode,
      });
    }

    if (endDate) {
      query.andWhere('ms.endDate = :endDate AND ms.endHour = :endHour', {
        endDate,
        endHour,
      });
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
    locationId: string,
    componentTypeCode: string,
    beginDate?: Date,
    beginHour?: number,
    endDate?: Date,
    endHour?: number,
    spanScaleCode?: string,
  ) {
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
