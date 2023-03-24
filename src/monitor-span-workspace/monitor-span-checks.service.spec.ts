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
  getSpanByFilter: jest.fn().mockResolvedValue(monitorSpan),
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

  describe('SPAN-56 MPC Value Valid', () => {
    it('Should get [SPAN-56-A] error', async () => {
      monitorSpan.componentTypeCode = 'NOX';
      monitorSpan.spanScaleCode = 'H';
      monitorSpan.mpcValue = null;

      try {
        await service.runChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-56-B] error', async () => {
      monitorSpan.componentTypeCode = 'FLOW';
      monitorSpan.spanScaleCode = 'L';
      monitorSpan.mpcValue = 55.0;

      try {
        await service.runChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-56-B] error', async () => {
      monitorSpan.componentTypeCode = 'FLOW';
      monitorSpan.spanScaleCode = 'L';
      monitorSpan.mpcValue = 0;

      try {
        await service.runChecks(monitorSpanBaseDTO, locationId);
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
        await service.runChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-57-B] error', async () => {
      monitorSpan.componentTypeCode = 'NOX';
      monitorSpan.spanScaleCode = 'H';
      monitorSpan.mecValue = null;
      monitorSpan.defaultHighRange = null;

      try {
        await service.runChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-57-C] error', async () => {
      monitorSpan.componentTypeCode = 'HG';

      try {
        await service.runChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [SPAN-57-D] error', async () => {
      monitorSpan.componentTypeCode = 'FLOW';
      monitorSpan.mecValue = 0;

      try {
        await service.runChecks(monitorSpanBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('duplicateSpanRecordCheck', () => {
    const mockMonitorSpan: MonitorSpanBaseDTO = {
      ...monitorSpan,
      componentTypeCode: 'FLOW',
      beginDate: new Date('2023-01-01'),
      beginHour: 1,
      endDate: new Date('2023-01-02'),
      endHour: 2,
      spanMethodCode: 'code1',
    };

    const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

    it('should return null if no duplicate record is found', async () => {
      jest.spyOn(repository, 'getSpanByFilter').mockResolvedValue(null);
      const result = await service['duplicateSpanRecordCheck'](
        'location1',
        mockMonitorSpan,
      );
      expect(result).toBeNull();
    });

    it('should return error message if a duplicate record is found', async () => {
      jest
        .spyOn(repository, 'getSpanByFilter')
        .mockResolvedValue(new MonitorSpan());

      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);

      const result = await service['duplicateSpanRecordCheck'](
        'location1',
        mockMonitorSpan,
      );
      expect(result).toBe(MOCK_ERROR_MSG);
    });

    // Add more test cases for different scenarios here
  });
});
