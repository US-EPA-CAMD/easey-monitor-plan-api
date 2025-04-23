import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DuctWaf } from '../entities/workspace/duct-waf.entity';

@Injectable()
export class DuctWafWorkspaceRepository extends Repository<DuctWaf> {
  constructor(entityManager: EntityManager) {
    super(DuctWaf, entityManager);
  }

  async getDuctWafByLocIdBeginOrEndDate(
    locationId: string,
    wafBeginDate: Date,
    wafBeginHour: number,
    wafEndDate: Date | null,
    wafEndHour: number | null,
  ): Promise<DuctWaf | null> {
    const query = this.createQueryBuilder('dw')
      .where('dw.locationId = :locationId', { locationId })
      .andWhere('dw.wafBeginDate = :wafBeginDate AND dw.wafBeginHour = :wafBeginHour', { wafBeginDate, wafBeginHour, });

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (wafEndDate !== null && wafEndHour !== null) {
      const endQuery = this.createQueryBuilder('dw')
        .where('dw.locationId = :locationId', { locationId })
        .andWhere('dw.wafEndDate = :wafEndDate AND dw.wafEndHour = :wafEndHour', {
          wafEndDate,
          wafEndHour,
        });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }

}
