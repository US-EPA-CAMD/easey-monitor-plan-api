import { EntityRepository, Repository } from 'typeorm';
import { UnitCapacity } from '../entities/workspace/unit-capacity.entity';

@EntityRepository(UnitCapacity)
export class UnitCapacityRepository extends Repository<UnitCapacity> {}
