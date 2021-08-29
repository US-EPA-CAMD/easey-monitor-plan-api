import { EntityRepository, Repository } from 'typeorm';

import { UnitControl } from '../entities/unit-control.entity';

@EntityRepository(UnitControl)
export class UnitControlRepository extends Repository<UnitControl> {}
