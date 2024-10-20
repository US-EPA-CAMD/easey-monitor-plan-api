import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { AnalyzerRangeWorkspaceController } from './analyzer-range.controller';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AnalyzerRangeChecksService } from './analyzer-range-checks.service';

jest.mock('./analyzer-range.service');

const locId = 'some location id';
const compId = 'some component id';

const data: AnalyzerRangeDTO[] = [];
data.push(new AnalyzerRangeDTO());
data.push(new AnalyzerRangeDTO());

const mockAnalyzerRangeChecksService = () => ({
  runSpanChecks: jest.fn(),
});

describe('AnalyzerRangeWorkspaceController', () => {
  let controller: AnalyzerRangeWorkspaceController;
  let service: AnalyzerRangeWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [AnalyzerRangeWorkspaceController],
      providers: [
        AnalyzerRangeWorkspaceService,
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: AnalyzerRangeChecksService,
          useFactory: mockAnalyzerRangeChecksService,
        },
      ],
    }).compile();

    controller = module.get(AnalyzerRangeWorkspaceController);
    service = module.get(AnalyzerRangeWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAnalyzerRanges', () => {
    it('should return array of analyzer ranges', async () => {
      jest.spyOn(service, 'getAnalyzerRanges').mockResolvedValue(data);
      expect(await controller.getAnalyzerRanges(locId, compId)).toBe(data);
    });
  });
});
