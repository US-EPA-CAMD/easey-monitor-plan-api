import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanReportResult } from '../entities/vw-monitor-plan-report-results.entity';
import { SelectQueryBuilder } from 'typeorm';

import { MonitorPlanReportResultRepository } from './monitor-plan-report-result.repository';

const mprr = new MonitorPlanReportResult();
const mockQueryBuilder = () => ({
  andWhere: jest.fn(),
  getMany: jest.fn(),
});

describe('MonitorPlanReportResultRepository', () => {
  let repository: MonitorPlanReportResultRepository;
  let queryBuilder;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorPlanReportResultRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(MonitorPlanReportResultRepository);
    queryBuilder = module.get<
      SelectQueryBuilder<MonitorPlanReportResultRepository>
    >(SelectQueryBuilder);
  });

  describe('getMPReportResults', () => {
    it('calls createQueryBuilder and gets MP Report results from the repository with the planId', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue(mprr);

      const result = await repository.getMPReportResults('1');

      expect(result).toEqual(mprr);
    });
  });
});
