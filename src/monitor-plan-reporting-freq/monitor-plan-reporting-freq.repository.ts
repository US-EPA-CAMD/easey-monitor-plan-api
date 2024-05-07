import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorPlanReportingFrequency } from '../entities/monitor-plan-reporting-freq.entity';

@Injectable()
export class MonitorPlanReportingFrequencyRepository extends Repository<
  MonitorPlanReportingFrequency
> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlanReportingFrequency, entityManager);
  }
}
