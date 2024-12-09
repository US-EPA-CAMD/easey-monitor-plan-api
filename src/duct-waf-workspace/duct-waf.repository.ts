import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DuctWaf } from '../entities/workspace/duct-waf.entity';

@Injectable()
export class DuctWafWorkspaceRepository extends Repository<DuctWaf> {
  constructor(entityManager: EntityManager) {
    super(DuctWaf, entityManager);
  }

  async getDuctWafByLocIdBDateBHourWafValue(
    locationId: string,
    wafBeginDate: Date,
    wafBeginHour: number,
    wafEndDate: Date,
    wafEndHour: number,
  ): Promise<DuctWaf> {
    const query = this.createQueryBuilder('dw')
      .where('dw.locationId = :locationId', {
        locationId,
      })
      .andWhere(
        `(dw.wafBeginDate = :wafBeginDate AND dw.wafBeginHour = :wafBeginHour)`,
        { wafBeginDate, wafBeginHour }
      );

    if (wafEndDate !== null && wafEndHour !== null) {
      query.andWhere(
        '(dw.wafEndDate = :wafEndDate AND dw.wafEndHour = :wafEndHour)',
        { wafEndDate, wafEndHour }
      );
    } else {
      query.andWhere('dw.wafEndDate IS NULL AND dw.wafEndHour IS NULL');
    }

    return query.getOne();
  }
}
