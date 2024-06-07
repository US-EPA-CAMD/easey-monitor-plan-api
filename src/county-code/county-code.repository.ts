import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CountyCode } from '../entities/county-code.entity';

@Injectable()
export class CountyCodeRepository extends Repository<CountyCode> {
  constructor(entityManager: EntityManager) {
    super(CountyCode, entityManager);
  }
}
