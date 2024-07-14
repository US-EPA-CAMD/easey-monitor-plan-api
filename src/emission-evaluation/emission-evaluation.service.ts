import { Injectable } from '@nestjs/common';

import { EmissionEvaluationRepository } from './emission-evaluation.repository';

@Injectable()
export class EmissionEvaluationService {
  constructor(private readonly repository: EmissionEvaluationRepository) {}

  async getLastEmissionEvaluationByStackPipeId(stackPipeId: string) {
    return this.repository
      .createQueryBuilder('ee')
      .innerJoinAndSelect('ee.reportingPeriod', 'rp')
      .innerJoin('ee.monitorPlan', 'mp')
      .innerJoin('mp.locations', 'ml')
      .innerJoin('ml.stackPipe', 'sp')
      .where('sp.name = :stackPipeId', { stackPipeId })
      .addOrderBy('rp.year', 'DESC')
      .addOrderBy('rp.quarter', 'DESC')
      .limit(1)
      .getOne();
  }

  async getLastEmissionEvaluationByUnitId(unitId: string) {
    return this.repository
      .createQueryBuilder('ee')
      .innerJoinAndSelect('ee.reportingPeriod', 'rp')
      .innerJoin('ee.monitorPlan', 'mp')
      .innerJoin('mp.locations', 'ml')
      .innerJoin('ml.unit', 'u')
      .where('u.name = :unitId', { unitId })
      .addOrderBy('rp.year', 'DESC')
      .addOrderBy('rp.quarter', 'DESC')
      .limit(1)
      .getOne();
  }
}
