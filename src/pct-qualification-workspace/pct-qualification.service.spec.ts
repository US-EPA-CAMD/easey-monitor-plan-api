import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { PCTQualification } from '../entities/workspace/pct-qualification.entity';
import {
  PCTQualificationBaseDTO,
  PCTQualificationDTO,
} from '../dtos/pct-qualification.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locId = '6';
const qualId = '1';
const pctQualId = 'some pct qualification id';
const userId = 'testuser';
const qualificationDataYear = 1990;

const returnedPCTQualification: PCTQualificationDTO = new PCTQualificationDTO();
const returnedPCTQualifications: PCTQualificationDTO[] = [
  returnedPCTQualification,
];

const payload: PCTQualificationBaseDTO = {
  qualificationYear: 2020,
  averagePercentValue: 1,
  yr1QualificationDataYear: 2000,
  yr1QualificationDataTypeCode: 'A',
  yr1PercentageValue: 1,
  yr2QualificationDataYear: 2000,
  yr2QualificationDataTypeCode: 'D',
  yr2PercentageValue: 1,
  yr3QualificationDataYear: 2000,
  yr3QualificationDataTypeCode: 'P',
  yr3PercentageValue: 1,
};

const pctQual = new PCTQualification();

const mockRepository = () => ({
  getPCTQualifications: jest.fn().mockResolvedValue(returnedPCTQualifications),
  getPCTQualification: jest.fn().mockResolvedValue(returnedPCTQualification),
  getPCTQualificationByDataYear: jest
    .fn()
    .mockResolvedValue(returnedPCTQualification),
  find: jest.fn().mockResolvedValue([returnedPCTQualification]),
  findOne: jest.fn().mockResolvedValue(returnedPCTQualification),
  create: jest.fn().mockResolvedValue(returnedPCTQualification),
  save: jest.fn().mockResolvedValue(returnedPCTQualification),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(returnedPCTQualification),
  many: jest.fn().mockResolvedValue(returnedPCTQualifications),
});

describe('PCTQualificationService', () => {
  let service: PCTQualificationWorkspaceService;
  let repository: PCTQualificationWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        PCTQualificationWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: PCTQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: PCTQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<PCTQualificationWorkspaceService>(
      PCTQualificationWorkspaceService,
    );
    repository = module.get<PCTQualificationWorkspaceRepository>(
      PCTQualificationWorkspaceRepository,
    );
  });

  describe('getPCTQualifications', () => {
    it('should return array of PCT qualifications', async () => {
      const result = await service.getPCTQualifications(locId, qualId);
      expect(result).toEqual(returnedPCTQualifications);
    });
  });

  describe('getPCTQualification', () => {
    it('should return PCT qualification for a specific qualification ID and location ID', async () => {
      const result = await service.getPCTQualification(
        locId,
        qualId,
        pctQualId,
      );
      expect(result).toEqual(returnedPCTQualification);
    });

    it('should throw error when PCT qualification not found', async () => {
      jest.spyOn(repository, 'getPCTQualification').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getPCTQualification(locId, qualId, pctQualId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getPCTQualificationByDataYear', () => {
    it('should return PCT qualification for a specific qualification ID , location ID and qualification data year', async () => {
      repository.getPCTQualificationByDataYear = jest
        .fn()
        .mockResolvedValue(returnedPCTQualification);
      const result = await service.getPCTQualificationByDataYear(
        locId,
        qualId,
        qualificationDataYear,
      );
      expect(repository.getPCTQualificationByDataYear).toHaveBeenCalledWith(
        locId,
        qualId,
        qualificationDataYear,
      );
      expect(result).toEqual(returnedPCTQualification);
    });

    it('should return null for a specific qualification ID , location ID and qualification data year when not found', async () => {
      repository.getPCTQualificationByDataYear = jest
        .fn()
        .mockResolvedValue(null);
      const result = await service.getPCTQualificationByDataYear(
        locId,
        qualId,
        qualificationDataYear,
      );
      expect(repository.getPCTQualificationByDataYear).toHaveBeenCalledWith(
        locId,
        qualId,
        qualificationDataYear,
      );
      expect(result).toEqual(null);
    });
  });

  describe('createPCTQualification', () => {
    it('creates a PCT qualification for a specific qualification ID', async () => {
      const result = await service.createPCTQualification(
        locId,
        qualId,
        payload,
        userId,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updatePCTQualification', () => {
    it('updates a PCT qualification for a specific qualification ID and location ID', async () => {
      jest
        .spyOn(service, 'getPCTQualification')
        .mockResolvedValue(returnedPCTQualification);

      const result = await service.updatePCTQualification(
        locId,
        qualId,
        pctQualId,
        payload,
        userId,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('importPCTQualification', () => {
    it('should create PCTQualification if not exists', async () => {
      const getPCTQualificationByDataYear = jest
        .spyOn(service, 'getPCTQualificationByDataYear')
        .mockResolvedValue(null);
      const createPCTQualification = jest
        .spyOn(service, 'createPCTQualification')
        .mockResolvedValue(returnedPCTQualification);
      await service.importPCTQualification(locId, qualId, [payload], userId);
      expect(getPCTQualificationByDataYear).toHaveBeenCalledWith(
        locId,
        qualId,
        payload.qualificationYear,
      );
      expect(createPCTQualification).toHaveBeenCalled;
    });

    it('should update PCTQualification if exists', async () => {
      const getPCTQualificationByDataYear = jest
        .spyOn(service, 'getPCTQualificationByDataYear')
        .mockResolvedValue(returnedPCTQualification);
      const updateLMEQualification = jest
        .spyOn(service, 'createPCTQualification')
        .mockResolvedValue(returnedPCTQualification);
      await service.importPCTQualification(locId, qualId, [payload], userId);
      expect(getPCTQualificationByDataYear).toHaveBeenCalledWith(
        locId,
        qualId,
        payload.qualificationYear,
      );
      expect(updateLMEQualification).toHaveBeenCalled;
    });
  });
});
