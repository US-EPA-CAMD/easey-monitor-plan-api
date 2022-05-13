import { Repository, EntityRepository } from 'typeorm';

import { Component } from '../entities/workspace/component.entity';

@EntityRepository(Component)
export class ComponentWorkspaceRepository extends Repository<Component> {
  async getComponent(componentId: string): Promise<Component> {
    return this.createQueryBuilder('c')
      .where('c.id = :componentId', {
        componentId,
      })
      .getOne();
  }

  async getComponentByLocIdAndCompId(
    locationId: string,
    componentId: string,
  ): Promise<Component> {
    return this.createQueryBuilder('c')
      .where('c.componentId = :componentId AND c.locationId = :locationId', {
        componentId,
        locationId,
      })
      .getOne();
  }
}
