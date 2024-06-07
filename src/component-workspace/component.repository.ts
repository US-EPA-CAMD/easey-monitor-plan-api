import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Component } from '../entities/workspace/component.entity';

@Injectable()
export class ComponentWorkspaceRepository extends Repository<Component> {
  constructor(entityManager: EntityManager) {
    super(Component, entityManager);
  }

  async getComponent(componentId: string): Promise<Component> {
    return this.createQueryBuilder('c')
      .where('c.id = :componentId', {
        componentId,
      })
      .getOne();
  }

  async getComponentByLocIdAndCompId(
    locationId: string,
    componentIdentifier: string,
  ): Promise<Component> {
    return this.createQueryBuilder('c')
      .where(
        'c.componentId = :componentIdentifier AND c.locationId = :locationId',
        {
          componentIdentifier,
          locationId,
        },
      )
      .getOne();
  }
}
