import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { PCTQualification } from '../entities/pct-qualification.entity';

@Injectable()
export class PCTQualificationRepository extends Repository<PCTQualification> {
  constructor(entityManager: EntityManager) {
    super(PCTQualification, entityManager);
  }
}
