import { EntityRepository, Repository } from 'typeorm';

import { UnitFuel } from '../entities/workspace/unit-fuel.entity';

@EntityRepository(UnitFuel)
export class UnitFuelWorkspaceRepository extends Repository<UnitFuel> {}
