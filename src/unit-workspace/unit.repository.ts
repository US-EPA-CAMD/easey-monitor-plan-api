import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Unit } from './unit.entity';

@Injectable()
export class UnitWorkspaceRepository extends Repository<Unit> {
  constructor(entityManager: EntityManager) {
    super(Unit, entityManager);
  }

  async getUnit(unitId: number): Promise<Unit> {
    const query = this.createQueryBuilder('u')
      .where('u.id = :unitId', { unitId });
    return query.getOne();
  }

  async getUnits(unitId: number): Promise<Unit[]> {
    return this.createQueryBuilder('u')
      .where('u.id = :unitId', { unitId })
      .getMany();
  }
}
