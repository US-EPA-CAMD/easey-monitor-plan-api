import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SubmissionAvailabilityCode } from '../entities/submission-availability-code.entity';

@Injectable()
export class SubmissionsAvailabilityStatusCodeRepository extends Repository<
  SubmissionAvailabilityCode
> {
  constructor(entityManager: EntityManager) {
    super(SubmissionAvailabilityCode, entityManager);
  }
}
