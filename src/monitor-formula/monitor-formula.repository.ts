import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorFormula } from '../entities/monitor-formula.entity';

@Injectable()
export class MonitorFormulaRepository extends Repository<MonitorFormula> {
  constructor(entityManager: EntityManager) {
    super(MonitorFormula, entityManager);
  }
}
