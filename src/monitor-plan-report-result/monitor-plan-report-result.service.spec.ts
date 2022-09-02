import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanReportResultService } from './monitor-plan-report-result.service';
import { MonitorPlanReportResultRepository } from './monitor-plan-report-result.repository';

const mockRepository = () => ({
  getMPReportResults: jest.fn().mockResolvedValue([]),
});

describe('MonitorPlanReportResultService', () => {
  let service: MonitorPlanReportResultService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorPlanReportResultService,
        MonitorPlanReportResultRepository,
        {
          provide: MonitorPlanReportResultRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MonitorPlanReportResultService);
  });

  describe('getMPReportResults', () => {
    it('should return array of monitor plan report results', async () => {
      const result = await service.getMPReportResults('5');
      expect(result).toEqual([]);
    });
  });
});
