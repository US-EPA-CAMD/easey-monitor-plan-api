import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsMethod } from '../entities/mats-method.entity';

@Injectable()
export class MatsMethodRepository extends Repository<MatsMethod> {
  constructor(entityManager: EntityManager) {
    super(MatsMethod, entityManager);
  }
}
