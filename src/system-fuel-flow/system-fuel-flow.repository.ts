import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';

@Injectable()
export class SystemFuelFlowRepository extends Repository<SystemFuelFlow> {
  constructor(entityManager: EntityManager) {
    super(SystemFuelFlow, entityManager);
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
}
