import { EntityRepository, Repository } from 'typeorm';

import { MatsMethod } from '../entities/workspace/mats-method.entity';

@EntityRepository(MatsMethod)
export class MatsMethodWorkspaceRepository extends Repository<MatsMethod> {}
