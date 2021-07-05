import { Repository, EntityRepository } from 'typeorm';

import { MatsMethod } from '../entities/mats-method.entity';

@EntityRepository(MatsMethod)
export class MatsMethodRepository extends Repository<MatsMethod> {}
