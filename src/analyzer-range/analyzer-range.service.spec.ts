import { Test, TestingModule } from '@nestjs/testing';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeService } from './analyzer-range.service';
import { AnalyzerRangeRepository } from './analyzer-range.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('AnalyzerRangeService', () => {
  let service: AnalyzerRangeService;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AnalyzerRangeService,
        {
          provide: AnalyzerRangeRepository,
          useFactory: mockRepository,
        },
        {
          provide: AnalyzerRangeMap,
          useFactory: mockMap,
        },
       { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(AnalyzerRangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAnalyzerRanges', () => {
    it('should return array of analyzer ranges', async () => {
     (useSlaveRepository as jest.Mock).mockImplementation(
       async (_dataSource, _repo, callback) =>
         callback(mockRepository()) 
     );
      const result = await service.getAnalyzerRanges(null);
      expect(result).toEqual('');
    });
  });
});
