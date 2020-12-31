import { Repository, EntityRepository } from 'typeorm';

import { MatsMethodData } from '../entities/mats-method-data.entity';

@EntityRepository(MatsMethodData)
export class MatsMethodRepository extends Repository<MatsMethodData>{

}