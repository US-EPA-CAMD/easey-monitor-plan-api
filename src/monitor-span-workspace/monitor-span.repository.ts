import { Repository, EntityRepository } from 'typeorm';

import { MonitorSpan } from '../entities/workspace/monitor-span.entity';

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
    beginDate: Date,
    beginHour: number,
    spanScaleCode: string,
  ): Promise<MonitorSpan> {
    return this.findOne({
      where: {
        locationId,
        componentTypeCode,
        beginDate,
        beginHour,
        spanScaleCode,
      },
      order: {
        id: 'ASC',
      },
    });
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
}
