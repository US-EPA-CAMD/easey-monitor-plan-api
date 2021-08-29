import { EntityRepository, Repository } from 'typeorm';

import { MonitorAttribute } from '../entities/workspace/monitor-attribute.entity';

@EntityRepository(MonitorAttribute)
export class MonitorAttributeWorkspaceRepository extends Repository<
  MonitorAttribute
> {}
