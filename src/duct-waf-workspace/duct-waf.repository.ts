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
    const result = this.createQueryBuilder('dw')
      .where('dw.locationId = :locationId', {
        locationId,
      })
      .andWhere(
        `((
          dw.wafBeginDate = :wafBeginDate AND dw.wafBeginHour = :wafBeginHour
        ) OR (
          dw.wafEndDate IS NOT NULL AND dw.wafEndDate = :wafEndDate AND dw.wafEndHour = :wafEndHour
        ))`,
        {
          wafBeginDate,
          wafBeginHour,
          wafEndDate,
          wafEndHour,
        },
      )
      .getOne();

    return result;
  }
}
