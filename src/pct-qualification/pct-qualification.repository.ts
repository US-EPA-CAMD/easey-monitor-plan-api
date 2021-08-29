import { EntityRepository, Repository } from 'typeorm';

import { PCTQualification } from '../entities/pct-qualification.entity';

@EntityRepository(PCTQualification)
export class PCTQualificationRepository extends Repository<PCTQualification> {}
