import { Repository, EntityRepository } from 'typeorm';

import { EvalStatusCode } from '../entities/eval-status-code.entity';

@EntityRepository(EvalStatusCode)
export class EvalStatusCodeRepository extends Repository<EvalStatusCode> {}
