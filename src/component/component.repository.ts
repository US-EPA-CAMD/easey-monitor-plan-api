import { Repository, EntityRepository } from 'typeorm';

import { Component } from '../entities/component.entity';

@EntityRepository(Component)
export class ComponentRepository extends Repository<Component>{
    async getSystemComponents() : Promise<Component[]>  {
        const components = this.createQueryBuilder("Component") 
           return await components.getMany();
          }
}