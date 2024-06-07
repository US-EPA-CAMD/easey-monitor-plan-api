import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LEEQualification } from '../entities/lee-qualification.entity';

@Injectable()
export class LEEQualificationRepository extends Repository<LEEQualification> {
  constructor(entityManager: EntityManager) {
    super(LEEQualification, entityManager);
  }
}
