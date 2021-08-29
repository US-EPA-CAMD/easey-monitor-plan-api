import { EntityRepository, Repository } from 'typeorm';

import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';

@EntityRepository(UnitStackConfiguration)
export class UnitStackConfigurationWorkspaceRepository extends Repository<
  UnitStackConfiguration
> {}
