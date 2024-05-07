import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SystemComponentMasterDataRelationships } from '../entities/system-component-master-data-relationship.entity';

@Injectable()
export class SystemComponentMasterDataRelationshipRepository extends Repository<
  SystemComponentMasterDataRelationships
> {
  constructor(entityManager: EntityManager) {
    super(SystemComponentMasterDataRelationships, entityManager);
  }
}
