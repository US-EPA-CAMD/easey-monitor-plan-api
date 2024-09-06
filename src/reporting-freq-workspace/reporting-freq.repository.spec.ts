import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { MonitorPlanReportingFrequency } from '../entities/workspace/monitor-plan-reporting-freq.entity';
import { ReportingFreqWorkspaceRepository } from './reporting-freq.repository';

const reportingFreqEntity = new MonitorPlanReportingFrequency(); // Mocked entity

// Mocking the SelectQueryBuilder and its methods
const mockQueryBuilder = (): Partial<SelectQueryBuilder<MonitorPlanReportingFrequency>> => ({
  where: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([reportingFreqEntity]),
  getOne: jest.fn().mockResolvedValue(reportingFreqEntity),
});

describe('ReportingFreqWorkspaceRepository', () => {
  let repository: ReportingFreqWorkspaceRepository;
  let queryBuilder: SelectQueryBuilder<MonitorPlanReportingFrequency>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        ReportingFreqWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    // Get the repository and query builder from the module
    repository = module.get(ReportingFreqWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<MonitorPlanReportingFrequency>>(SelectQueryBuilder);

    // Mocking the createQueryBuilder to return the queryBuilder mock
    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getReportingFreqs', () => {
    it('calls createQueryBuilder and returns an array of reporting frequencies', async () => {
      // Cast to jest.Mock to avoid TypeScript errors
      (queryBuilder.where as jest.Mock).mockReturnValue(queryBuilder);
      (queryBuilder.getMany as jest.Mock).mockReturnValue([reportingFreqEntity]);

      const result = await repository.getReportingFreqs('locationId', 1);
      expect(result).toEqual([reportingFreqEntity]);
      expect(queryBuilder.where).toHaveBeenCalledWith('rf.id = :unitId', { unitId: 1 });
    });
  });

  describe('getReportingFreq', () => {
    it('calls createQueryBuilder and returns a single reporting frequency', async () => {
      // Cast to jest.Mock to avoid TypeScript errors
      (queryBuilder.where as jest.Mock).mockReturnValue(queryBuilder);
      (queryBuilder.getOne as jest.Mock).mockReturnValue(reportingFreqEntity);

      const result = await repository.getReportingFreq('reportingFreqId');
      expect(result).toEqual(reportingFreqEntity);
      expect(queryBuilder.where).toHaveBeenCalledWith('rf.id = :unitReportingFreqId', { unitReportingFreqId: 'reportingFreqId' });
    });
  });
});
