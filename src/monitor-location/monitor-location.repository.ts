import { Repository, EntityRepository } from 'typeorm';

import { MonitorLocation } from '../entities/monitor-location.entity';

@EntityRepository(MonitorLocation)
export class MonitorLocationRepository extends Repository<MonitorLocation> {
  async getMonitorLocationsByFacId(facId: number): Promise<MonitorLocation[]> {
    return this.createQueryBuilder('ml')
      .innerJoinAndSelect('ml.plans', 'p')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'stp')
      .leftJoinAndSelect('u.opStatuses', 'uos')
      .leftJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('p.facId = :facId', { facId })
      .andWhere('uos.endDate IS NULL')
      .addOrderBy('u.name, stp.name')
      .getMany();
  }

  async getMonitorLocationsByPlanId(
    monPlanId: string,
  ): Promise<MonitorLocation[]> {
    return this.createQueryBuilder('ml')
      .innerJoinAndSelect('ml.plans', 'p')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'stp')
      .leftJoinAndSelect('u.opStatuses', 'uos')
      .leftJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('p.id = :monPlanId', { monPlanId })
      .andWhere('uos.endDate IS NULL')
      .addOrderBy('u.name, stp.name')
      .getMany();
  }
}
