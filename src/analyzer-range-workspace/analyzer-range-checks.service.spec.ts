import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AnalyzerRangeChecksService } from './analyzer-range-checks.service';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { AnalyzerRangeBaseDTO } from '../dtos/analyzer-range.dto';
import { Component } from '../entities/workspace/component.entity';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const locationId = '1';
const payload = new AnalyzerRangeBaseDTO();
const component = new Component();
const analyzerRange = new AnalyzerRange();

const mockComponentWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(component),
});

const analyzerRangeWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(analyzerRange),
  getAnalyzerRangeByComponentIdAndDate: jest
    .fn()
    .mockResolvedValue(analyzerRange),
  getAnalyzerRangesByCompIds: jest.fn().mockResolvedValue([analyzerRange]),
});

describe('Analyzer Range Checks Service Test', () => {
  let service: AnalyzerRangeChecksService;
  let componentRepository: ComponentWorkspaceRepository;
  let analyzerRangeRepository: AnalyzerRangeWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        AnalyzerRangeChecksService,
        {
          provide: ComponentWorkspaceRepository,
          useFactory: mockComponentWorkspaceRepository,
        },
        {
          provide: AnalyzerRangeWorkspaceRepository,
          useFactory: analyzerRangeWorkspaceRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyzerRangeChecksService>(
      AnalyzerRangeChecksService,
    );
    componentRepository = module.get<ComponentWorkspaceRepository>(
      ComponentWorkspaceRepository,
    );
    analyzerRangeRepository = module.get<AnalyzerRangeWorkspaceRepository>(
      AnalyzerRangeWorkspaceRepository,
    );

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('COMPON-54 Duplicate Analyzer Range Check', () => {
    analyzerRange.beginDate = new Date(Date.now());
    analyzerRange.beginHour = 21;
    analyzerRange.endDate = new Date(Date.now());
    analyzerRange.endHour = 21;

    it('Should get [COMPON-54-A] error', async () => {
      jest
        .spyOn(analyzerRangeRepository, 'getAnalyzerRangeByComponentIdAndDate')
        .mockResolvedValueOnce(analyzerRange);

      try {
        await service.runChecks(locationId, analyzerRange);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
