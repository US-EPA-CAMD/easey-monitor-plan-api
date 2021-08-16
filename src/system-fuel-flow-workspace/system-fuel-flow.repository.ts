import { Repository, EntityRepository } from 'typeorm';

import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';

@EntityRepository(SystemFuelFlow)
export class SystemFuelFlowWorkspaceRepository extends Repository<
  SystemFuelFlow
> {
  async getFuelFlows(monSysId: string): Promise<SystemFuelFlow[]> {
    return this.createQueryBuilder('sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('ms.id = :monSysId', { monSysId })
      .getMany();
  }
}
