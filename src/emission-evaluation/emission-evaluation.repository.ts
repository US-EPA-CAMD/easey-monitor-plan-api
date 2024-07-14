import { Injectable } from '@nestjs/common';
import { EmissionEvaluation } from '@us-epa-camd/easey-common/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class EmissionEvaluationRepository extends Repository<
  EmissionEvaluation
> {
  constructor(entityManager: EntityManager) {
    super(EmissionEvaluation, entityManager);
  }
}
