import { Test, TestingModule } from '@nestjs/testing';
import { MonitorPlanReportingFrequencyRepository } from './monitor-plan-reporting-freq.repository';
import { EntityManager } from 'typeorm';
import { MonitorPlanReportingFrequencyService } from './monitor-plan-reporting-freq.service';

const mockRepository = () => ({
  getReportingFreqs: jest.fn().mockResolvedValue([]),
});

const mockEntityManager = () => ({
  query: jest.fn().mockResolvedValue([]),
});

describe('MonitorPlanReportingFrequencyService', () => {
  let service: MonitorPlanReportingFrequencyService;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorPlanReportingFrequencyService,
        {
          provide: MonitorPlanReportingFrequencyRepository,
          useFactory: mockRepository,
        },
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get(MonitorPlanReportingFrequencyService);
    entityManager = module.get(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReportingFreqs', () => {
    it('should return an array of reporting frequencies', async () => {
      const result = await service.getReportingFreqs(1);
      expect(result).toEqual([]);
    });
  });
});
