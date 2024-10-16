import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { v4 as uuid } from 'uuid';

import { MonitorPlanReportingFrequency } from '../entities/workspace/monitor-plan-reporting-freq.entity';

@Injectable()
export class MonitorPlanReportingFrequencyWorkspaceRepository extends Repository<
  MonitorPlanReportingFrequency
> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlanReportingFrequency, entityManager);
  }

  async createReportingFrequencyRecord({
    beginReportPeriodId,
    endReportPeriodId,
    monitorPlanId,
    reportFrequencyCode,
    userId,
  }: {
    beginReportPeriodId: number;
    endReportPeriodId: number;
    monitorPlanId: string;
    reportFrequencyCode: string;
    userId: string;
  }) {
    const record = this.create({
      id: uuid(),
      beginReportPeriodId,
      endReportPeriodId,
      monitorPlanId,
      reportFrequencyCode,
      userId,
      addDate: currentDateTime(),
    });

    return await this.save(record);
  }

  async getReportingFreq(
    unitReportingFreqId: string,
  ): Promise<MonitorPlanReportingFrequency> {
    const query = this.createQueryBuilder(
      'rf',
    ).where('rf.id = :unitReportingFreqId', { unitReportingFreqId });

    return query.getOne();
  }
}
