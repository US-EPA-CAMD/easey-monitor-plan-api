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

  async getSpanByLocIdCompTypeCodeAndDate(
    locationId: string,
    span: MonitorSpanBaseDTO,
  ): Promise<MonitorSpan> {
    const componentTypeCode = span.componentTypeCode;
    const beginDate = span.beginDate;
    const beginHour = span.beginHour;
    const endDate = span.endDate;
    const endHour = span.endHour;

    return this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.componentTypeCode = :componentTypeCode', {
        componentTypeCode,
      })
      .andWhere(
        '(ms.beginDate = :beginDate AND ms.beginHour = :beginHour) AND (ms.endDate = :endDate AND ms.endHour = :endHour)',
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
