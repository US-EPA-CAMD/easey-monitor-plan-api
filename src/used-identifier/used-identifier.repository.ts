import { EntityRepository, Repository } from 'typeorm';
import { UsedIdentifier } from '../entities/used-identifier.entity';

@EntityRepository(UsedIdentifier)
export class UsedIdentifierRepository extends Repository<UsedIdentifier> {

    async getBySpecs(locationId: string, identifier: string, tableCode: string):
        Promise<UsedIdentifier> {
        return this.createQueryBuilder('uid')
            .where('locationId = :locationId', { locationId })
            .andWhere('identifier = :identifier', { identifier })
            .andWhere('tableCode = :tableCode', { tableCode })
            .getOne();
    }
}
