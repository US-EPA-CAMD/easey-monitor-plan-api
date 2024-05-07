import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EvalStatusCode } from '../entities/eval-status-code.entity';

@Injectable()
export class EvalStatusCodeRepository extends Repository<EvalStatusCode> {
  constructor(entityManager: EntityManager) {
    super(EvalStatusCode, entityManager);
  }
}
