import { Repository, EntityRepository } from 'typeorm';

import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';

@EntityRepository(MonitorFormula)
export class MonitorFormulaWorkspaceRepository extends Repository<
  MonitorFormula
> {}
