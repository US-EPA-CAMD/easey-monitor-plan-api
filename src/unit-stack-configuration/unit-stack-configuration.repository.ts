import { EntityRepository, Repository } from 'typeorm';

import { UnitStackConfiguration } from '../entities/unit-stack-configuration.entity';

@EntityRepository(UnitStackConfiguration)
export class UnitStackConfigurationRepository extends Repository<
  UnitStackConfiguration
> {}
