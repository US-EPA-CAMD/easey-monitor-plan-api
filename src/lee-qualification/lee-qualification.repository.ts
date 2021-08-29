import { EntityRepository, Repository } from 'typeorm';

import { LEEQualification } from '../entities/lee-qualification.entity';

@EntityRepository(LEEQualification)
export class LEEQualificationRepository extends Repository<LEEQualification> {}
