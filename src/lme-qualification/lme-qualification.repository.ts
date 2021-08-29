import { EntityRepository, Repository } from 'typeorm';

import { LMEQualification } from '../entities/lme-qualification.entity';

@EntityRepository(LMEQualification)
export class LMEQualificationRepository extends Repository<LMEQualification> {}
