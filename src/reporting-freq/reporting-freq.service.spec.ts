import { Test, TestingModule } from '@nestjs/testing';
import { ReportingFreqRepository } from './reporting-freq.repository';
import { EntityManager } from 'typeorm';
import { ReportingFreqService } from './reporting-freq.service';

const mockRepository = () => ({
  getReportingFreqs: jest.fn().mockResolvedValue([]),
});

const mockEntityManager = () => ({
  query: jest.fn().mockResolvedValue([]),
});

describe('ReportingFreqService', () => {
  let service: ReportingFreqService;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportingFreqService,
        {
          provide: ReportingFreqRepository,
          useFactory: mockRepository,
        },
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get(ReportingFreqService);
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
