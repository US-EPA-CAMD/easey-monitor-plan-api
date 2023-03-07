import { EntityRepository, Repository } from 'typeorm';
import { UsedIdentifier } from '../entities/used-identifier.entity';

@EntityRepository(UsedIdentifier)
export class UsedIdentifierRepository extends Repository<UsedIdentifier> {}
