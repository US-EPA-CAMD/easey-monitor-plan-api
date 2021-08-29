import { EntityRepository, Repository } from 'typeorm';

import { UnitFuel } from '../entities/unit-fuel.entity';

@EntityRepository(UnitFuel)
export class UnitFuelRepository extends Repository<UnitFuel> {}
