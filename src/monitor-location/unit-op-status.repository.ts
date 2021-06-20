import { Repository, EntityRepository } from 'typeorm';

import { UnitOpStatus } from '../entities/unit-op-status.entity';

@EntityRepository(UnitOpStatus)
export class UnitOpStatusRepository extends Repository<UnitOpStatus> {
  async getUnitStatuses(): Promise<UnitOpStatus[]> {
    const unitStatus = this.createQueryBuilder('UnitOpStatus');
    return unitStatus.getMany();
  }
}
