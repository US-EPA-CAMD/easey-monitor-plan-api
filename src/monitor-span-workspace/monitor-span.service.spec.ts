import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorSpan } from '../entities/workspace/monitor-span.entity';
import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const span = new MonitorSpan();
const spans = [span];

const payload = new MonitorSpanBaseDTO();

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(spans),
  getSpan: jest.fn().mockResolvedValue(span),
  create: jest.fn().mockResolvedValue(span),
  save: jest.fn().mockResolvedValue(span),
  getSpanByLocIdCompTypeCdBDateBHour: jest.fn().mockResolvedValue(span),
});

const spanDTO = new MonitorSpanDTO();

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([spanDTO]),
  one: jest.fn().mockResolvedValue(spanDTO),
});

describe('MonitorSpanWorkspaceService', () => {
  let service: MonitorSpanWorkspaceService;
  let repository: MonitorSpanWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      providers: [
        MonitorSpanWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorSpanWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSpanMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    repository = module.get(MonitorSpanWorkspaceRepository);
    service = module.get(MonitorSpanWorkspaceService);
  });

  describe('getSpans', () => {
    it('should return array of monitor spans', async () => {
      const result = await service.getSpans('1');
      expect(result).toEqual(spans);
    });
  });

  describe('getSpan', () => {
    it('should return a monitor span', async () => {
      const result = await service.getSpan('1', '1');
      expect(result).toEqual(span);
    });

    it('should throw error when system component not found', async () => {
      jest.spyOn(repository, 'getSpan').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getSpan('1', '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createSpan', () => {
    it('should create and return monitor span when monitor span found', async () => {
      const result = await service.createSpan({
        locationId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(span);
    });
  });

  describe('updateSpan', () => {
    it('should update and return monitor span when monitor span found', async () => {
      jest.spyOn(service, 'getSpan').mockResolvedValue(span);

      const result = await service.updateSpan({
        locationId: '1',
        spanId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(spanDTO);
    });
  });

  describe('runSpanChecks', () => {
    it('Should pass import check with other than "FLOW" componentTypeCode', async () => {
      const testSpanData = payload;
      testSpanData.componentTypeCode = 'HCL';
      testSpanData.mpfValue = null;
      testSpanData.flowSpanValue = null;
      testSpanData.flowFullScaleRange = null;

      const checkResults = await service.runSpanChecks([testSpanData]);

      expect(checkResults).toEqual([]);
    });

    it('Should pass import check with "FLOW" componentTypeCode', async () => {
      const testSpanData = new MonitorSpanBaseDTO();
      testSpanData.componentTypeCode = 'FLOW';
      testSpanData.mpcValue = null;
      testSpanData.mecValue = null;
      testSpanData.defaultHighRange = null;
      testSpanData.scaleTransitionPoint = null;
      testSpanData.spanScaleCode = null;

      const checkResults = await service.runSpanChecks([testSpanData]);

      expect(checkResults).toEqual([]);
    });
    it('Should fail import check with "FLOW" componentTypeCode', async () => {
      const testSpanData = new MonitorSpanBaseDTO();
      testSpanData.componentTypeCode = 'FLOW';

      const checkResults = await service.runSpanChecks([testSpanData]);

      const errorlist = [
        '[IMPORT10-NONCRIT-A] An extraneous value has been reported for mpcValue in the span record for FLOW. This value was not imported.',
        '[IMPORT10-NONCRIT-A] An extraneous value has been reported for mecValue in the span record for FLOW. This value was not imported.',
        '[IMPORT10-NONCRIT-A] An extraneous value has been reported for defaultHighRange in the span record for FLOW. This value was not imported.',
        '[IMPORT10-NONCRIT-A] An extraneous value has been reported for scaleTransitionPoint in the span record for FLOW. This value was not imported.',
        '[IMPORT10-NONCRIT-A] An extraneous value has been reported for spanScaleCode in the span record for FLOW. This value was not imported.',
      ];
      expect(checkResults).toEqual(errorlist);
    });
  });

  describe('importSpan', () => {
    it('should create while importing monitor span', async () => {
      const result = await service.importSpan('1', [payload], 'testUser');
      expect(result).toEqual(true);
    });
    it('should update while importing monitor span', async () => {
      jest
        .spyOn(repository, 'getSpanByLocIdCompTypeCdBDateBHour')
        .mockResolvedValue(undefined);

      const result = await service.importSpan('1', [payload], 'testUser');
      expect(result).toEqual(true);
    });
  });
});
