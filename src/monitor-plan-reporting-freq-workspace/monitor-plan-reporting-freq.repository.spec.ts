import { Test } from '@nestjs/testing';
import { MonitorPlanReportingFrequencyWorkspaceRepository } from './monitor-plan-reporting-freq.repository';

describe('MonitorPlanReportingFrequencyWorkspaceRepository', () => {
  let repository: MonitorPlanReportingFrequencyWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MonitorPlanReportingFrequencyWorkspaceRepository],
    }).compile();

    repository = module.get(MonitorPlanReportingFrequencyWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
