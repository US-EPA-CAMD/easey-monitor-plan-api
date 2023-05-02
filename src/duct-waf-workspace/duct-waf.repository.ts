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
    return this.createQueryBuilder('dw')
      .where('dw.locationId = :locationId', { locationId })
      .andWhere('dw.wafBeginDate = :wafBeginDate', { wafBeginDate })
      .andWhere('dw.wafBeginHour = :wafBeginHour', { wafBeginHour })
      .andWhere('dw.wafEndDate = :wafEndDate', { wafEndDate })
      .andWhere('dw.wafEndHour = :wafEndHour', { wafEndHour })
      .andWhere('dw.wafValue = :wafValue', { wafValue })
      .getOne();
  }
}
