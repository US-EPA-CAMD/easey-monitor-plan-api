import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { MonitorQualificationBaseDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualification } from '../entities/workspace/monitor-qualification.entity';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';

const locId = '6';
const qualId = '1';
const userId = 'testuser';

const returnedMonitorQualifications: MonitorQualificationDTO[] = [];
const returnedMonitorQualification: MonitorQualificationDTO = new MonitorQualificationDTO();

const payload: MonitorQualificationBaseDTO = {
  qualificationTypeCode: '',
  beginDate: new Date(Date.now()),
  endDate: new Date(Date.now()),
  leeQualifications: [],
  lmeQualifications: [],
  pctQualifications: [],
};

const mockRepository = () => ({
  getQualifications: jest.fn().mockResolvedValue(returnedMonitorQualifications),
  getQualification: jest.fn().mockResolvedValue(returnedMonitorQualification),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new MonitorQualification()),
  create: jest.fn().mockResolvedValue(new MonitorQualification()),
  save: jest.fn().mockResolvedValue(new MonitorQualification()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('MonitorQualificationService', () => {
  let loadService: MonitorQualificationWorkspaceService;
  let loadRepository: MonitorQualificationWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorQualificationWorkspaceService,
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
    loadRepository = module.get(MonitorQualificationWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(loadService).toBeDefined();
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
        userId,
        locId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateQualification', () => {
    it('updates a PCT qualification for a specific qualification ID and location ID', async () => {
      const result = await loadService.updateQualification(
        userId,
        locId,
        qualId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
