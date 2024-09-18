import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import {
  AnalyzerRangeBaseDTO,
  AnalyzerRangeDTO,
} from '../dtos/analyzer-range.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

const mockRepo = () => ({
  getAnalyzerRangeByComponentIdAndDate: jest.fn(),
});

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
          useFactory: mockRepo,
        },
        {
          provide: AnalyzerRangeMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AnalyzerRangeWorkspaceService>(
      AnalyzerRangeWorkspaceService,
    );
    repositoryMock = module.get<AnalyzerRangeWorkspaceRepository>(
      AnalyzerRangeWorkspaceRepository,
    );
  });

  describe('importAnalyzerRange', () => {
    const analyzerRangeImport = [new AnalyzerRangeBaseDTO()];
    it('should create analyzer range if not exists', async () => {
      repositoryMock.getAnalyzerRangeByComponentIdAndDate = jest
        .fn()
        .mockResolvedValue(null);
      const createAnalyzerRange = jest
        .spyOn(service, 'createAnalyzerRange')
        .mockResolvedValue(new AnalyzerRangeDTO());
      await service.importAnalyzerRange(
        'componentId',
        'locationId',
        'userId',
        analyzerRangeImport,
      );
      expect(
        repositoryMock.getAnalyzerRangeByComponentIdAndDate,
      ).toHaveBeenCalledWith('componentId', analyzerRangeImport[0]);
      expect(createAnalyzerRange).toHaveBeenCalled;
    });

    it('should update analyzer range if exists', async () => {
      repositoryMock.getAnalyzerRangeByComponentIdAndDate = jest
        .fn()
        .mockResolvedValue(new AnalyzerRangeDTO());
      const updateAnalyzerRange = jest
        .spyOn(service, 'updateAnalyzerRange')
        .mockResolvedValue(new AnalyzerRangeDTO());
      await service.importAnalyzerRange(
        'componentId',
        'locationId',
        'userId',
        analyzerRangeImport,
      );
      expect(
        repositoryMock.getAnalyzerRangeByComponentIdAndDate,
      ).toHaveBeenCalledWith('componentId', analyzerRangeImport[0]);
      expect(updateAnalyzerRange).toHaveBeenCalled;
    });
  });
});
