import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Plant } from '../entities/workspace/plant.entity';

@Injectable()
export class PlantWorkspaceRepository extends Repository<Plant> {
  constructor(entityManager: EntityManager) {
    super(Plant, entityManager);
  }
}
