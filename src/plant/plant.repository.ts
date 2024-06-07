import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Plant } from '../entities/plant.entity';

@Injectable()
export class PlantRepository extends Repository<Plant> {
  constructor(entityManager: EntityManager) {
    super(Plant, entityManager);
  }
}
