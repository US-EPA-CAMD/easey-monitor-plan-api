import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorSpan } from '../entities/workspace/monitor-span.entity';
import { MonitorSpanBaseDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanChecksService } from './monitor-span-checks.service';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const locationId = 'locationId';
const monitorSpanBaseDTO = new MonitorSpanBaseDTO();
const monitorSpan = new MonitorSpan();

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monitorSpan),
  getSpanByLocIdCompTypeCdBDateBHour: jest.fn().mockResolvedValue(monitorSpan),
  getSpanByLocIdCompTypeCdEDateEHour: jest.fn().mockResolvedValue(monitorSpan),
});

describe('Monitoring Span Check Service Test', () => {
  let service: MonitorSpanChecksService;
  let repository: MonitorSpanWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        MonitorSpanChecksService,
        {
          provide: MonitorSpanWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MonitorSpanChecksService);
    repository = module.get(MonitorSpanWorkspaceRepository);
    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('SPAN-55 Duplicate Span Records', () => {
    it('Should get [SPAN-55-A] error', async () => {
      monitorSpan.componentTypeCode = 'FLOW';
      monitorSpan.beginDate = new Date(Date.now());
      monitorSpan.beginHour = 21;
      monitorSpan.endDate = new Date(Date.now());
      monitorSpan.endHour = 21;

      jest
        .spyOn(repository, 'getSpanByLocIdCompTypeCdBDateBHour')
        .mockResolvedValue(monitorSpan);
      jest
        .spyOn(repository, 'getSpanByLocIdCompTypeCdEDateEHour')
        .mockResolvedValue(monitorSpan);

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('SPAN-55 Duplicate Span Records', () => {
    it('Should get [SPAN-55-A] error', async () => {
      monitorSpan.componentTypeCode = 'FLOW';
      monitorSpan.beginDate = new Date(Date.now());
      monitorSpan.beginHour = 21;
      monitorSpan.endDate = new Date(Date.now());
      monitorSpan.endHour = 21;

      jest
        .spyOn(repository, 'getSpanByLocIdCompTypeCdBDateBHour')
        .mockResolvedValue(monitorSpan);
      jest
        .spyOn(repository, 'getSpanByLocIdCompTypeCdEDateEHour')
        .mockResolvedValue(monitorSpan);

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('SPAN-56 MPC Value Valid', () => {
    it('Should get [SPAN-56-A] error', async () => {
      monitorSpan.componentTypeCode = 'NOX';
      monitorSpan.spanScaleCode = 'H';
      monitorSpan.mpcValue = null;

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-56-B] error', async () => {
      monitorSpan.componentTypeCode = 'FLOW';
      monitorSpan.spanScaleCode = 'L';
      monitorSpan.mpcValue = 55.0;

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-56-B] error', async () => {
      monitorSpan.componentTypeCode = 'FLOW';
      monitorSpan.spanScaleCode = 'L';
      monitorSpan.mpcValue = 0;

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('SPAN-57 MEC Value Valid', () => {
    it('Should get [SPAN-57-A] error', async () => {
      monitorSpan.componentTypeCode = 'NOX';
      monitorSpan.spanScaleCode = 'L';
      monitorSpan.mecValue = null;

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-57-B] error', async () => {
      monitorSpan.componentTypeCode = 'NOX';
      monitorSpan.spanScaleCode = 'H';
      monitorSpan.mecValue = null;

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-57-C] error', async () => {
      monitorSpan.componentTypeCode = 'HG';

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-57-D] error', async () => {
      monitorSpan.componentTypeCode = 'FLOW';
      monitorSpan.mecValue = 0;

      try {
        await service.runSpanChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
