import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MonitorPlanReportingFrequencyRepository } from './monitor-plan-reporting-freq.repository';

describe('MonitorPlanReportingFrequencyWorkspaceRepository', () => {
  let repository: MonitorPlanReportingFrequencyRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntityManager, MonitorPlanReportingFrequencyRepository],
    }).compile();

    repository = module.get(MonitorPlanReportingFrequencyRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
