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

  async getFuelFlowByLogicalKey(
    monSysId: string,
    beginDate: Date,
    beginHour: number,
  ): Promise<SystemFuelFlow | null> {
    return this.createQueryBuilder('sff')
      .where('sff.monitoringSystemRecordId = :monSysId', { monSysId })
      .andWhere('sff.beginDate = :beginDate', { beginDate })
      .andWhere('sff.beginHour = :beginHour', { beginHour })
      .getOne();
  }

}
