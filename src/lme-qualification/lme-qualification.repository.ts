import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LMEQualification } from '../entities/lme-qualification.entity';

@Injectable()
export class LMEQualificationRepository extends Repository<LMEQualification> {
  constructor(entityManager: EntityManager) {
    super(LMEQualification, entityManager);
  }
}
