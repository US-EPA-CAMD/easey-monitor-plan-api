import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { StackPipe } from '../entities/workspace/stack-pipe.entity';

@Injectable()
export class StackPipeRepository extends Repository<StackPipe> {
  constructor(entityManager: EntityManager) {
    super(StackPipe, entityManager);
  }
}
