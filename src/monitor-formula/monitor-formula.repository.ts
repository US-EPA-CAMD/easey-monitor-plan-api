import { Repository, EntityRepository } from 'typeorm';

import { MonitorFormula } from '../entities/monitor-formula.entity';

@EntityRepository(MonitorFormula)
export class MonitorFormulaRepository extends Repository<MonitorFormula> {}
