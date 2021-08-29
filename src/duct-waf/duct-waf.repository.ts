import { EntityRepository, Repository } from 'typeorm';

import { DuctWaf } from '../entities/duct-waf.entity';

@EntityRepository(DuctWaf)
export class DuctWafRepository extends Repository<DuctWaf> {}
