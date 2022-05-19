import { Repository, EntityRepository } from 'typeorm';

import { SystemFuelFlow } from '../entities/workspace/system-fuel-flow.entity';

@EntityRepository(SystemFuelFlow)
export class SystemFuelFlowWorkspaceRepository extends Repository<
  SystemFuelFlow
> {
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
      .getMany();
  }

  async getFuelFlowByBeginOrEndDate(
    monSysId: string,
    maximumFuelFlowRate: number,
    systemFuelFlowUOMCode: string,
  ): Promise<SystemFuelFlow> {
    return this.createQueryBuilder('sff')
      .where('sff.monitoringSystemRecordId = :monSysId', { monSysId })
      .andWhere('sff.maximumFuelFlowRate = :maximumFuelFlowRate', {
        maximumFuelFlowRate,
      })
      .andWhere('sff.systemFuelFlowUOMCode = :systemFuelFlowUOMCode', {
        systemFuelFlowUOMCode,
      })
      .getOne();
  }
}
