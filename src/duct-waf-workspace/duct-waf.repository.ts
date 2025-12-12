import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DuctWaf } from '../entities/workspace/duct-waf.entity';

@Injectable()
export class DuctWafWorkspaceRepository extends Repository<DuctWaf> {
  constructor(entityManager: EntityManager) {
    super(DuctWaf, entityManager);
  }

  async getDuctWafByLogicalKey(
    locationId: string,
    wafBeginDate: Date,
    wafBeginHour: number,
  ): Promise<DuctWaf | null> {
     return this.createQueryBuilder('dw')
      .where('dw.locationId = :locationId', { locationId })
      .andWhere('dw.wafBeginDate = :wafBeginDate', { wafBeginDate })
      .andWhere('dw.wafBeginHour = :wafBeginHour', { wafBeginHour })
      .getOne();
  }

}
