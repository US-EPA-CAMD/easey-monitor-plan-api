import { Repository, EntityRepository } from 'typeorm';

import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';

@EntityRepository(MonitorFormula)
export class MonitorFormulaWorkspaceRepository extends Repository<
  MonitorFormula
> {
  async getFormula(locationId: string, id: string): Promise<MonitorFormula> {
    return this.createQueryBuilder('mf')
      .where('mf.locationId = :locationId', { locationId })
      .andWhere('mf.id = :id ', { id })
      .getOne();
  }
}
