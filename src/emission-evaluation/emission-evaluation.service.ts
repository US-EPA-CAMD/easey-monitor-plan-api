import { Injectable } from '@nestjs/common';

import { EmissionEvaluationRepository } from './emission-evaluation.repository';

@Injectable()
export class EmissionEvaluationService {
  constructor(private readonly repository: EmissionEvaluationRepository) {}

  async getLastEmissionEvaluationByStackPipeId(
    stackPipeId: string,
    facilityId: number,
  ) {
    return this.repository
      .createQueryBuilder('ee')
      .innerJoinAndSelect('ee.reportingPeriod', 'rp')
      .innerJoin('ee.monitorPlan', 'mp')
      .innerJoin('mp.locations', 'ml')
      .innerJoin('ml.stackPipe', 'sp')
      .where('sp.name = :stackPipeId', { stackPipeId })
      .andWhere('sp.facId = :facilityId', { facilityId })
      .addOrderBy('rp.year', 'DESC')
      .addOrderBy('rp.quarter', 'DESC')
      .limit(1)
      .getOne();
  }

  async getLastEmissionEvaluationByUnitId(unitId: string, facilityId: number) {
    return this.repository
      .createQueryBuilder('ee')
      .innerJoinAndSelect('ee.reportingPeriod', 'rp')
      .innerJoin('ee.monitorPlan', 'mp')
      .innerJoin('mp.locations', 'ml')
      .innerJoin('ml.unit', 'u')
      .where('u.name = :unitId', { unitId })
      .andWhere('u.facId = :facilityId', { facilityId })
      .addOrderBy('rp.year', 'DESC')
      .addOrderBy('rp.quarter', 'DESC')
      .limit(1)
      .getOne();
  }
}
