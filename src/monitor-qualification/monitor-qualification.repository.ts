import { EntityRepository, Repository } from 'typeorm';

import { MonitorQualification } from '../entities/monitor-qualification.entity';

@EntityRepository(MonitorQualification)
export class MonitorQualificationRepository extends Repository<
  MonitorQualification
> {}
