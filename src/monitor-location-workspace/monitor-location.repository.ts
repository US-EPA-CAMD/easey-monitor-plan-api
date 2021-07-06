import { Repository, EntityRepository } from 'typeorm';

import { MonitorLocation } from '../entities/workspace/monitor-location.entity';

@EntityRepository(MonitorLocation)
export class MonitorLocationWorkspaceRepository extends Repository<
  MonitorLocation
> {
  async getMonitorLocationsByFacId(facId: number): Promise<MonitorLocation[]> {
    return this.createQueryBuilder('ml')
      .innerJoinAndSelect('ml.plans', 'p')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'stp')
      .leftJoinAndSelect('u.opStatuses', 'uos')
      .where('p.facId = :facId', { facId })
      .andWhere('uos.endDate IS NULL')
      .addOrderBy('u.name, stp.name')
      .getMany();
  }
}
