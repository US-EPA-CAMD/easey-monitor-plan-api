import { Test, TestingModule } from '@nestjs/testing';
import { MonitorPlanReportingFrequencyWorkspaceRepository } from './monitor-plan-reporting-freq.repository';
import { EntityManager } from 'typeorm';
import { MonitorPlanReportingFrequencyWorkspaceService } from './monitor-plan-reporting-freq.service';

const mockRepository = () => ({
  getReportingFreqs: jest.fn().mockResolvedValue([]),
});

const mockEntityManager = () => ({
  query: jest.fn().mockResolvedValue([]),
});

describe('MonitorPlanReportingFrequencyWorkspaceService', () => {
  let service: MonitorPlanReportingFrequencyWorkspaceService;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorPlanReportingFrequencyWorkspaceService,
        {
          provide: MonitorPlanReportingFrequencyWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get(MonitorPlanReportingFrequencyWorkspaceService);
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
