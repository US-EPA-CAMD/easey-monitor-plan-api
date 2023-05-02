import { EntityRepository, Repository } from 'typeorm';

import { DuctWaf } from '../entities/workspace/duct-waf.entity';

@EntityRepository(DuctWaf)
export class DuctWafWorkspaceRepository extends Repository<DuctWaf> {
  async getDuctWafByLocIdBDateBHourWafValue(
    locationId: string,
    wafBeginDate: Date,
    wafEndDate: Date,
    wafBeginHour: number,
    wafEndHour: number,
    wafValue: number,
  ): Promise<DuctWaf> {
    const result = this.createQueryBuilder('dw')
      .where('dw.locationId = :locId', {
        locationId,
      })
      .andWhere(
        '((dw.beginDate = :beginDate AND dw.beginHour = :beginHour) OR ((dw.endDate is not null) AND ( dw.endDate = :endDate AND dw.endHour = :endHour )))',

        {
          wafBeginDate,
          wafEndDate,
          wafBeginHour,
          wafEndHour,
          wafValue,
        },
      )
      .getOne();

    return result;
  }
}
