import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorLocation } from '../entities/workspace/monitor-location.entity';

@Injectable()
export class MonitorLocationWorkspaceRepository extends Repository<
  MonitorLocation
> {
  constructor(entityManager: EntityManager) {
    super(MonitorLocation, entityManager);
  }

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

  async getLocationsByUnitStackPipeIds(
    orisCode: number,
    unitIds: string[],
    stackPipeIds: string[],
  ): Promise<MonitorLocation[]> {
    let unitsWhere =
      unitIds?.length > 0
        ? 'up.orisCode = :orisCode AND u.name IN (:...unitIds)'
        : '';

    let stacksWhere =
      stackPipeIds?.length > 0
        ? 'spp.orisCode = :orisCode AND sp.name IN (:...stackPipeIds)'
        : '';

    if (unitIds?.length > 0 && stackPipeIds?.length > 0) {
      unitsWhere = `(${unitsWhere})`;
      stacksWhere = ` OR (${stacksWhere})`;
    }

    return this.createQueryBuilder('ml')
      .leftJoinAndSelect('ml.systems', 'ms')
      .leftJoinAndSelect('ml.components', 'c')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('u.opStatuses', 'uos')
      .leftJoin('u.plant', 'up')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoin('sp.plant', 'spp')
      .where(`${unitsWhere}${stacksWhere}`, {
        orisCode,
        unitIds,
        stackPipeIds,
      })
      .getMany();
  }
}
