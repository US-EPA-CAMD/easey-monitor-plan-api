import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorPlanReportingFrequency } from '../entities/workspace/monitor-plan-reporting-freq.entity';

@Injectable()
export class MonitorPlanReportingFrequencyWorkspaceRepository extends Repository<
  MonitorPlanReportingFrequency
> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlanReportingFrequency, entityManager);
  }
}
