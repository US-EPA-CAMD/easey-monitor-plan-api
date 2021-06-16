import { Repository, EntityRepository } from 'typeorm';

import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';

@EntityRepository(SystemFuelFlow)
export class SystemFuelFlowRepository extends Repository<SystemFuelFlow>{
   async SysFuelFlow(monSysId: string) : Promise<SystemFuelFlow[]>  {
      const query = this.createQueryBuilder("sff")
         .innerJoinAndSelect('sff.system', 'ms', 'ms.id = :id', { id: monSysId });
      return query.getMany();
   }
}