import { EntityRepository, Repository } from 'typeorm';

import { DuctWaf } from '../entities/workspace/duct-waf.entity';

@EntityRepository(DuctWaf)
export class DuctWafWorkspaceRepository extends Repository<DuctWaf> {}
