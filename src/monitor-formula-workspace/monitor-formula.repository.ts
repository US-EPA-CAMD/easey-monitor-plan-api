import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';

@Injectable()
export class MonitorFormulaWorkspaceRepository extends Repository<
  MonitorFormula
> {
  constructor(entityManager: EntityManager) {
    super(MonitorFormula, entityManager);
  }

  async getFormula(locationId: string, id: string): Promise<MonitorFormula> {
    return this.createQueryBuilder('mf')
      .where('mf.locationId = :locationId', { locationId })
      .andWhere('mf.id = :id ', { id })
      .getOne();
  }

  async getFormulaByLocIdAndFormulaIdentifier(
    locationId: string,
    formulaId: string,
  ): Promise<MonitorFormula> {
    return this.createQueryBuilder('mf')
      .where('mf.locationId = :locationId', { locationId })
      .andWhere('mf.formulaId = :formulaId', { formulaId })
      .getOne();
  }
}
