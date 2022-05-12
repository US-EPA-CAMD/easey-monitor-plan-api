import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { Repository } from 'typeorm';
import { AnalyzerRange } from 'src/entities/workspace/analyzer-range.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyzerRangeBaseDTO } from 'src/dtos/analyzer-range.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const repositoryMockFactory = () => ({
  find: jest.fn().mockResolvedValue(''),
  findOne: jest.fn(entity => entity),
});

/* const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  getAnalyzerRangeByComponentIdAndDate: jest.fn(entity => entity),
  // ...
})); */

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

const analyzerRange = {
  "id": "01968-GJ09-109A3C82EFD4412196C46611B6644257",
  "componentRecordId": "01968-GJ09-892A2A2756B94347A4CFE444B7CD3DD5",
  "analyzerRangeCode": "H",
  "dualRangeIndicator": 0,
  "beginDate": "2016-07-01",
  "endDate": null,
  "beginHour": 0,
  "endHour": null,
  "userId": "kezell",
  "addDate": "2016-09-14",
  "updateDate": "2016-10-30",
  "active": true
}

const analyzerRangeImport = {
  "analyzerRangeCode": "H",
  "dualRangeIndicator": 0,
  "beginDate": "2016-07-01",
  "endDate": null,
  "beginHour": 0,
  "endHour": null
}

describe('AnalyzerRangeWorkspaceService', () => {
  let service: AnalyzerRangeWorkspaceService;
  let repositoryMock: AnalyzerRangeWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        AnalyzerRangeWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: AnalyzerRangeWorkspaceRepository,
          useFactory: repositoryMockFactory,
        },
        {
          provide: AnalyzerRangeMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(AnalyzerRangeWorkspaceService);
    repositoryMock = module.get(getRepositoryToken(AnalyzerRange));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAnalyzerRanges', () => {
    it('should return array of analyzer ranges', async () => {
      const result = await service.getAnalyzerRanges(null);
      expect(result).toEqual('');
    });
  });

  describe('importAnalyzerRange', () => {
    it('should create analyzer range else updates', async () => {
      repositoryMock.getAnalyzerRangeByComponentIdAndDate.mockReturnValue(analyzerRange);
      expect(service.importAnalyzerRange(
        'componentId',
        'locationId',
        analyzerRangeImport,
        'userId')).toEqual(null);
     expect(repositoryMock.getAnalyzerRangeByComponentIdAndDate).toHaveBeenCalledWith('componentId',analyzerRange);
    });
  });
});
