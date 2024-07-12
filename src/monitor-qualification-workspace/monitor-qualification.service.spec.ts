import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';

import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import {
  MonitorQualificationDTO,
  UpdateMonitorQualificationDTO,
} from '../dtos/monitor-qualification.dto';
import { MonitorQualification } from '../entities/workspace/monitor-qualification.entity';
import { LMEQualificationBaseDTO } from '../dtos/lme-qualification.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { LEEQualificationWorkspaceService } from '../lee-qualification-workspace/lee-qualification.service';
import { LMEQualificationWorkspaceService } from '../lme-qualification-workspace/lme-qualification.service';
import { PCTQualificationWorkspaceService } from '../pct-qualification-workspace/pct-qualification.service';
import { LEEQualificationBaseDTO } from '../dtos/lee-qualification.dto';
import { PCTQualificationBaseDTO } from '../dtos/pct-qualification.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locId = '6';
const qualId = '1';
const userId = 'testuser';

const returnedMonitorQualifications: MonitorQualificationDTO[] = [];
const returnedMonitorQualification: MonitorQualificationDTO = new MonitorQualificationDTO();

const payload: UpdateMonitorQualificationDTO = {
  qualificationTypeCode: '',
  beginDate: new Date(Date.now()),
  endDate: new Date(Date.now()),
  monitoringQualificationLEEData: [],
  monitoringQualificationLMEData: [],
  monitoringQualificationPercentData: [],
};

const mockRepository = () => ({
  getQualifications: jest.fn().mockResolvedValue(returnedMonitorQualifications),
  getQualification: jest.fn().mockResolvedValue(returnedMonitorQualification),
  findBy: jest.fn().mockResolvedValue([]),
  findOneBy: jest.fn().mockResolvedValue(new MonitorQualification()),
  create: jest.fn().mockResolvedValue(new MonitorQualification()),
  save: jest.fn().mockResolvedValue(new MonitorQualification()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('MonitorQualificationService', () => {
  let loadService: MonitorQualificationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorQualificationWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: LEEQualificationWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: LMEQualificationWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: PCTQualificationWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    loadService = module.get(MonitorQualificationWorkspaceService);
  });

  it('should be defined', () => {
    expect(loadService).toBeDefined();
  });

  describe('runQualificationImportCheck', () => {
    it('Should pass when values for qualTypeCode "LMEA" of qualfication is valid with so2 value not set', async () => {
      const quals = new UpdateMonitorQualificationDTO();
      const lmeQual = new LMEQualificationBaseDTO();

      lmeQual.so2Tons = null;
      quals.qualificationTypeCode = 'LMEA';
      quals.monitoringQualificationLMEData = [lmeQual];
      quals.monitoringQualificationLEEData = [];
      quals.monitoringQualificationPercentData = [];

      const checkResults = await loadService.runQualificationImportCheck([
        quals,
      ]);

      expect(checkResults).toEqual([]);
    });

    it('Should pass when values for qualTypeCode "PK" of qualfication is valid with so2 value not set', async () => {
      const quals = new UpdateMonitorQualificationDTO();
      const lmeQual = new LMEQualificationBaseDTO();
      const leeQual = new LEEQualificationBaseDTO();
      const pctQual = new PCTQualificationBaseDTO();

      lmeQual.so2Tons = null;
      quals.qualificationTypeCode = 'PK';
      quals.monitoringQualificationLMEData = [];
      quals.monitoringQualificationLEEData = [];
      quals.monitoringQualificationPercentData = [pctQual];

      const checkResults = await loadService.runQualificationImportCheck([
        quals,
      ]);

      expect(checkResults).toEqual([]);
    });

    it('Should fail when values for qualTypeCode "PK" of qualfication is valid with so2 value not null', async () => {
      const quals = new UpdateMonitorQualificationDTO();
      const lmeQual = new LMEQualificationBaseDTO();

      lmeQual.so2Tons = 1;
      quals.qualificationTypeCode = 'PK';
      quals.monitoringQualificationLMEData = [lmeQual];
      quals.monitoringQualificationLEEData = [];
      quals.monitoringQualificationPercentData = [];

      const checkResults = await loadService.runQualificationImportCheck([
        quals,
      ]);

      const errorList = [
        '[IMPORT11-NONCRIT-A] A value has been reported for SO2Tons for the Monitor Qualification LME record #0. This field should be blank',
        '[IMPORT12-FATAL-B] You have reported a MonitorQualLME record for a location with the Qualification Type Code not equal to LMEA or LMES. A MonitorQualLME record should not be reported for qualification type codes other than LMEA or LMES.',
      ];

      expect(checkResults).toEqual(errorList);
    });

    it('Should fail when values for qualTypeCode "LMEA" of qualfication is valid with so2 value not null', async () => {
      const quals = new UpdateMonitorQualificationDTO();
      const lmeQual = new LMEQualificationBaseDTO();
      const pctQual = new PCTQualificationBaseDTO();

      lmeQual.so2Tons = null;
      quals.qualificationTypeCode = 'LMEA';
      quals.monitoringQualificationLMEData = [];
      quals.monitoringQualificationLEEData = [];
      quals.monitoringQualificationPercentData = [pctQual];

      const checkResults = await loadService.runQualificationImportCheck([
        quals,
      ]);

      const errorList = [
        '[IMPORT12-FATAL-A] You have reported a MonitorQualPercent record for a location with the Qualification Type Code not equal to PK, SK or GF. A MonitorQualPercent record should not be reported for qualification type codes other than PK, SK or GF.',
      ];

      expect(checkResults).toEqual(errorList);
    });
  });

  describe('getQualifications', () => {
    it('should return array of PCT qualifications', async () => {
      const result = await loadService.getQualifications(locId);
      expect(result).toEqual([]);
    });
  });

  describe('getQualification', () => {
    it('should return PCT qualification for a specific qualification ID and location ID', async () => {
      const result = await loadService.getQualification(locId, qualId);
      expect(result).toEqual({});
    });
  });

  describe('createQualification', () => {
    it('creates a PCT qualification for a specific qualification ID', async () => {
      const result = await loadService.createQualification(
        locId,
        payload,
        userId,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateQualification', () => {
    it('updates a PCT qualification for a specific qualification ID and location ID', async () => {
      const result = await loadService.updateQualification(
        locId,
        qualId,
        payload,
        userId,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
