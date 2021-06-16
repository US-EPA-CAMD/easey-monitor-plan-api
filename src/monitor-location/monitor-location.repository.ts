import { Repository, EntityRepository } from 'typeorm';

import { MonitorLocation } from '../entities/monitor-location.entity';

@EntityRepository(MonitorLocation)
export class MonitorLocationRepository extends Repository<MonitorLocation> {
  async getMonitorLocationsByFacId(facId: number): Promise<MonitorLocation[]> {
    const query = this.createQueryBuilder('location')
      .innerJoinAndSelect('location.plans', 'plan', 'plan.facId = :facId', {
        facId: facId,
      })
      .leftJoinAndSelect('location.unit', 'unit')
      .leftJoinAndSelect('location.stackPipe', 'stackPipe')
      .addOrderBy('unit.name, stackPipe.name');
    return await query.getMany();
  }
}
