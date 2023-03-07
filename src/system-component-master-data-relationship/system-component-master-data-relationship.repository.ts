import { SystemComponentMasterDataRelationships } from '../entities/system-component-master-data-relationship.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(SystemComponentMasterDataRelationships)
export class SystemComponentMasterDataRelationshipRepository extends Repository<
  SystemComponentMasterDataRelationships
> {}
