import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UsedIdentifier } from '../entities/used-identifier.entity';

@Injectable()
export class UsedIdentifierRepository extends Repository<UsedIdentifier> {
  constructor(entityManager: EntityManager) {
    super(UsedIdentifier, entityManager);
  }

  async getBySpecs(
    locationId: string,
    identifier: string,
    tableCode: string,
  ): Promise<UsedIdentifier> {
    return this.createQueryBuilder('uid')
      .where('uid.locationId = :locationId', { locationId })
      .andWhere('uid.identifier = :identifier', { identifier })
      .andWhere('uid.tableCode = :tableCode', { tableCode })
      .getOne();
  }
}
