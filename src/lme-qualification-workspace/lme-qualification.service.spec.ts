import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { LMEQualification } from '../entities/workspace/lme-qualification.entity';
import {
  LMEQualificationBaseDTO,
  LMEQualificationDTO,
} from '../dtos/lme-qualification.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locId = '6';
const qualId = '1';
const lmeQualId = 'some lme qualification id';
const userId = 'testuser';
const qualificationDataYear = 2021;

const returnedLMEQualifications: LMEQualificationDTO[] = [];
const returnedLMEQualification: LMEQualificationDTO = new LMEQualificationDTO();

const payload: LMEQualificationBaseDTO = {
  qualificationDataYear: 2021,
  operatingHours: 10,
  so2Tons: 1.5,
  noxTons: 1.5,
};

const mockRepository = () => ({
  getLMEQualifications: jest.fn().mockResolvedValue(returnedLMEQualifications),
  getLMEQualification: jest.fn().mockResolvedValue(returnedLMEQualification),
  getLMEQualificationByDataYear: jest
    .fn()
    .mockResolvedValue(returnedLMEQualification),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new LMEQualification()),
  create: jest.fn().mockResolvedValue(new LMEQualification()),
  save: jest.fn().mockResolvedValue(new LMEQualification()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('LMEQualificationWorkspaceService', () => {
  let lmeQualService: LMEQualificationWorkspaceService;
  let lmeQualRepository: LMEQualificationWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LMEQualificationWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: LMEQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: LMEQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    lmeQualService = module.get<LMEQualificationWorkspaceService>(
      LMEQualificationWorkspaceService,
    );
    lmeQualRepository = module.get<LMEQualificationWorkspaceRepository>(
      LMEQualificationWorkspaceRepository,
    );
  });

  it('should be defined', () => {
    expect(lmeQualService).toBeDefined();
  });

  describe('getLMEQualifications', () => {
    it('should return array of LEE qualifications', async () => {
      const result = await lmeQualService.getLMEQualifications(locId, qualId);
      expect(result).toEqual([]);
    });
  });

  describe('getLMEQualification', () => {
    it('should return LEE qualification for a specific qualification ID and location ID', async () => {
      const result = await lmeQualService.getLMEQualification(
        locId,
        qualId,
        lmeQualId,
      );
      expect(result).toEqual({});
    });
  });

  describe('getLMEQualificationByDataYear', () => {
    it('should return LEE qualification for a specific qualification ID , location ID and qualification data year', async () => {
      lmeQualRepository.getLMEQualificationByDataYear = jest
        .fn()
        .mockResolvedValue(returnedLMEQualification);
      const result = await lmeQualService.getLMEQualificationByDataYear(
        locId,
        qualId,
        qualificationDataYear,
      );
      expect(
        lmeQualRepository.getLMEQualificationByDataYear,
      ).toHaveBeenCalledWith(locId, qualId, qualificationDataYear);
      expect(result).toEqual(returnedLMEQualification);
    });
  });

  describe('createLMEQualification', () => {
    it('creates a LME qualification for a specific qualification ID', async () => {
      const result = await lmeQualService.createLMEQualification(
        userId,
        locId,
        qualId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateLMEQualification', () => {
    it('updates a LME qualification for a specific qualification ID and location ID', async () => {
      const result = await lmeQualService.updateLMEQualification(
        userId,
        locId,
        qualId,
        lmeQualId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('importLmeQualification', () => {
    it('should create LMEQualification if not exists', async () => {
      const getLMEQualificationByDataYear = jest
        .spyOn(lmeQualService, 'getLMEQualificationByDataYear')
        .mockResolvedValue(null);
      const createLMEQualification = jest
        .spyOn(lmeQualService, 'createLMEQualification')
        .mockResolvedValue(new LMEQualificationDTO());
      await lmeQualService.importLmeQualification(
        locId,
        qualId,
        [payload],
        userId,
      );
      expect(getLMEQualificationByDataYear).toHaveBeenCalledWith(
        locId,
        qualId,
        payload.qualificationDataYear,
      );
      expect(createLMEQualification).toHaveBeenCalled;
    });

    it('should update LMEQualification if exists', async () => {
      const getLMEQualificationByDataYear = jest
        .spyOn(lmeQualService, 'getLMEQualificationByDataYear')
        .mockResolvedValue(returnedLMEQualification);
      const updateLMEQualification = jest
        .spyOn(lmeQualService, 'updateLMEQualification')
        .mockResolvedValue(returnedLMEQualification);
      await lmeQualService.importLmeQualification(
        locId,
        qualId,
        [payload],
        userId,
      );
      expect(getLMEQualificationByDataYear).toHaveBeenCalledWith(
        locId,
        qualId,
        payload.qualificationDataYear,
      );
      expect(updateLMEQualification).toHaveBeenCalled;
    });
  });
});
