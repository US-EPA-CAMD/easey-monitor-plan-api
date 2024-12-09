import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SystemFuelFlowBaseDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlow } from '../entities/workspace/system-fuel-flow.entity';

@Injectable()
export class SystemFuelFlowWorkspaceRepository extends Repository<
  SystemFuelFlow
> {
  constructor(entityManager: EntityManager) {
    super(SystemFuelFlow, entityManager);
  }

  async getFuelFlow(id: string): Promise<SystemFuelFlow> {
    return this.createQueryBuilder('sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('sff.id = :id', { id })
      .getOne();
  }

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlow[]> {
    return this.createQueryBuilder('sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('ms.id = :monSysId', { monSysId })
      .getMany();
  }

  async getFuelFlowsBySystemIds(
    monSysIds: string[],
  ): Promise<SystemFuelFlow[]> {
    return this.createQueryBuilder('sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('ms.id IN (:...monSysIds)', { monSysIds })
      .orderBy('sff.id')
      .getMany();
  }

  async getFuelFlowByBeginOrEndDate(
    monSysId: string,
    fuelFlow: SystemFuelFlowBaseDTO,
  ): Promise<SystemFuelFlow> {
    const beginDate = fuelFlow.beginDate;
    const beginHour = fuelFlow.beginHour;
    const endDate = fuelFlow.endDate;
    const endHour = fuelFlow.endHour;

    const query = this.createQueryBuilder(
      'sff',
    ).where('sff.monitoringSystemRecordId = :monSysId', { monSysId });

    query.andWhere(
      `(sff.beginDate = :beginDate AND sff.beginHour = :beginHour)`,
      { beginDate, beginHour }
    );

    if (endDate !== null && endHour !== null) {
      query.andWhere(
        '(sff.endDate = :endDate AND sff.endHour = :endHour)',
        { endDate, endHour }
      );
    } else {
      query.andWhere('sff.endDate IS NULL AND sff.endHour IS NULL');
    }

    return query.getOne();
  }
}
