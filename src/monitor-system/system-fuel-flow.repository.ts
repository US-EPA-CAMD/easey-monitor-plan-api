import { Repository, EntityRepository } from 'typeorm';

import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';

@EntityRepository(SystemFuelFlow)
export class SystemFuelFlowRepository extends Repository<SystemFuelFlow>{
   async SysFuelFlow() : Promise<SystemFuelFlow[]>  {
    const fuel = this.createQueryBuilder("System Fuel") 
       return await fuel.getMany();
      }
}