import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { useSlaveQueryRunner } from '../utilities/use-slave-query';

@Injectable()
export class SystemFuelFlowRepository extends Repository<SystemFuelFlow> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(SystemFuelFlow, entityManager);
  }

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlow[]> {
    return useSlaveQueryRunner(this.dataSource, async (qr) => {
     return qr.createQueryBuilder(SystemFuelFlow, 'sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('ms.id = :monSysId', { monSysId })
      .getMany();
    })
  }

  async getFuelFlowsBySystemIds(
    monSysIds: string[],
  ): Promise<SystemFuelFlow[]> {
    return useSlaveQueryRunner(this.dataSource, async (qr) => {
     return qr.createQueryBuilder(SystemFuelFlow, 'sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('ms.id IN (:...monSysIds)', { monSysIds })
      .orderBy('sff.id')
      .getMany();
    });
  }
}
