import { Repository, EntityRepository } from 'typeorm';

import { Component } from '../entities/component.entity';

@EntityRepository(Component)
export class ComponentRepository extends Repository<Component>{

}