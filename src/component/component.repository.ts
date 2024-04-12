import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Component } from '../entities/component.entity';

@Injectable()
export class ComponentRepository extends Repository<Component> {
  constructor(entityManager: EntityManager) {
    super(Component, entityManager);
  }
}
