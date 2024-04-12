import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DuctWaf } from '../entities/duct-waf.entity';

@Injectable()
export class DuctWafRepository extends Repository<DuctWaf> {
  constructor(entityManager: EntityManager) {
    super(DuctWaf, entityManager);
  }
}
