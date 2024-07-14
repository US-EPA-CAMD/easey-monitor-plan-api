import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionEvaluation } from '../entities/emission-evaluation.entity';

@Injectable()
export class EmissionEvaluationRepository extends Repository<
  EmissionEvaluation
> {
  constructor(entityManager: EntityManager) {
    super(EmissionEvaluation, entityManager);
  }
}
