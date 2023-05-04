import { Repository, EntityRepository } from 'typeorm';

import { SubmissionAvailabilityCode } from '../entities/submission-availability-code.entity';

@EntityRepository(SubmissionAvailabilityCode)
export class SubmissionsAvailabilityStatusCodeRepository extends Repository<
  SubmissionAvailabilityCode
> {}
