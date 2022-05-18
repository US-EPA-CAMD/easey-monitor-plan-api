import { EntityRepository, Repository } from 'typeorm';

import { DuctWaf } from '../entities/workspace/duct-waf.entity';

@EntityRepository(DuctWaf)
export class DuctWafWorkspaceRepository extends Repository<DuctWaf> {
  async getDuctWafByLocIdBDateBHourWafValue(
    locationId: string,
    wafBeginDate: Date,
    wafBeginHour: number,
    wafValue: number,
  ): Promise<DuctWaf> {
    return this.createQueryBuilder('dw')
      .where('dw.locationId = :locationId', { locationId })
      .andWhere('dw.wafBeginDate = :wafBeginDate', { wafBeginDate })
      .andWhere('dw.wafBeginHour = :wafBeginHour', { wafBeginHour })
      .andWhere('dw.wafValue = :wafValue', { wafValue })
      .getOne();
  }
}
