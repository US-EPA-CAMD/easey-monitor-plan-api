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

  async getMonitorLocationsByPlanId(
    monPlanId: string,
  ): Promise<MonitorLocation[]> {
    return this.createQueryBuilder('ml')
      .innerJoinAndSelect('ml.plans', 'p')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'stp')
      .leftJoinAndSelect('u.opStatuses', 'uos')
      .where('p.id = :monPlanId', { monPlanId })
      .andWhere('uos.endDate IS NULL')
      .addOrderBy('u.name, stp.name')
      .getMany();
  }

  async getLocationsByUnitStackPipeIds(
    facilityId: number,
    unitIds: string[],
    stackPipeIds: string[],
  ): Promise<MonitorLocation[]> {
    let unitsWhere =
      unitIds && unitIds.length > 0
        ? 'up.orisCode = :facilityId AND u.name IN (:...unitIds)'
        : '';

    let stacksWhere =
      stackPipeIds && stackPipeIds.length > 0
        ? 'spp.orisCode = :facilityId AND sp.name IN (:...stackPipeIds)'
        : '';

    if (unitIds?.length > 0 && stackPipeIds?.length > 0) {
      unitsWhere = `(${unitsWhere})`;
      stacksWhere = ` OR (${stacksWhere})`;
    }

    const query = this.createQueryBuilder('ml')
      .innerJoinAndSelect('ml.systems', 'ms')
      .innerJoinAndSelect('ml.components', 'c')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoin('u.plant', 'up')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoin('sp.plant', 'spp')
      .where(`${unitsWhere}${stacksWhere}`, {
        facilityId,
        unitIds,
        stackPipeIds,
      });

    return query.getMany();
  }
}
