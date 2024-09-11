import { Test, TestingModule } from '@nestjs/testing';
import { ReportingFreqWorkspaceRepository } from './reporting-freq.repository';
import { EntityManager } from 'typeorm';
import { ReportingFreqWorkspaceService } from './reporting-freq.service';

const mockRepository = () => ({
  getReportingFreqs: jest.fn().mockResolvedValue([]),
});

const mockEntityManager = () => ({
  query: jest.fn().mockResolvedValue([]),
});

describe('ReportingFreqWorkspaceService', () => {
  let service: ReportingFreqWorkspaceService;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportingFreqWorkspaceService,
        {
          provide: ReportingFreqWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get(ReportingFreqWorkspaceService);
    entityManager = module.get(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReportingFreqs', () => {
    it('should return an array of reporting frequencies', async () => {
      const result = await service.getReportingFreqs('locId', 1);
      expect(result).toEqual([]);
    });
  });
});
