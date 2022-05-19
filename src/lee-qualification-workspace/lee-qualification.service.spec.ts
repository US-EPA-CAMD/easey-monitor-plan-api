import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { LEEQualification } from '../entities/workspace/lee-qualification.entity';
import {
  LEEQualificationBaseDTO,
  LEEQualificationDTO,
} from '../dtos/lee-qualification.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locId = '6';
const qualId = '1';
const leeQualId = 'some lee qualification id';
const userId = 'testuser';
const qualificationTestDate = new Date(Date.now());

const returnedLEEQualifications: LEEQualificationDTO[] = [];
const returnedLEEQualification: LEEQualificationDTO = new LEEQualificationDTO();

const payload: LEEQualificationBaseDTO = {
  qualificationTestDate: new Date(Date.now()),
  parameterCode: 'HG',
  qualificationTestType: 'INITIAL',
  potentialAnnualMassEmissions: null,
  applicableEmissionStandard: 1.2,
  unitsOfStandard: 'LBTBTU',
  percentageOfEmissionStandard: 1.4,
};

const mockRepository = () => ({
  getLEEQualifications: jest.fn().mockResolvedValue(returnedLEEQualifications),
  getLEEQualification: jest.fn().mockResolvedValue(returnedLEEQualification),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new LEEQualification()),
  create: jest.fn().mockResolvedValue(new LEEQualification()),
  save: jest.fn().mockResolvedValue(new LEEQualification()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('LEEQualificationService', () => {
  let leeQualService: LEEQualificationWorkspaceService;
  let leeQualRepository: LEEQualificationWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LEEQualificationWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: LEEQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: LEEQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    leeQualService = module.get<LEEQualificationWorkspaceService>(
      LEEQualificationWorkspaceService,
    );
    leeQualRepository = module.get<LEEQualificationWorkspaceRepository>(
      LEEQualificationWorkspaceRepository,
    );
  });

  it('should be defined', () => {
    expect(leeQualService).toBeDefined();
  });

  describe('getLEEQualifications', () => {
    it('should return array of LEE qualifications', async () => {
      const result = await leeQualService.getLEEQualifications(locId, qualId);
      expect(result).toEqual([]);
    });
  });

  describe('getLEEQualification', () => {
    it('should return LEE qualification for a specific qualification ID and location ID', async () => {
      const result = await leeQualService.getLEEQualification(
        locId,
        qualId,
        leeQualId,
      );
      expect(result).toEqual({});
    });
  });

  describe('getLEEQualificationByTestDate', () => {
    it('should return LEE qualification for a specific qualification ID , location ID and qualification test date', async () => {
      leeQualRepository.getLEEQualificationByTestDate = jest
        .fn()
        .mockResolvedValue(returnedLEEQualification);
      const result = await leeQualService.getLEEQualificationByTestDate(
        locId,
        qualId,
        qualificationTestDate,
      );
      expect(
        leeQualRepository.getLEEQualificationByTestDate,
      ).toHaveBeenCalledWith(locId, qualId, qualificationTestDate);
      expect(result).toEqual(returnedLEEQualification);
    });

    it('should return null for a specific qualification ID , location ID and qualification test data when not found', async () => {
      leeQualRepository.getLEEQualificationByTestDate = jest
        .fn()
        .mockResolvedValue(null);
      const result = await leeQualService.getLEEQualificationByTestDate(
        locId,
        qualId,
        qualificationTestDate,
      );
      expect(
        leeQualRepository.getLEEQualificationByTestDate,
      ).toHaveBeenCalledWith(locId, qualId, qualificationTestDate);
      expect(result).toEqual(null);
    });
  });

  describe('createLEEQualification', () => {
    it('creates a LEE qualification for a specific qualification ID', async () => {
      const result = await leeQualService.createLEEQualification(
        userId,
        locId,
        qualId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateLEEQualification', () => {
    it('updates a LEE qualification for a specific qualification ID and location ID', async () => {
      const result = await leeQualService.updateLEEQualification(
        userId,
        locId,
        qualId,
        leeQualId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('importLEEQualification', () => {
    it('should create LEEQualification if not exists', async () => {
      const getLEEQualificationByTestDate = jest
        .spyOn(leeQualService, 'getLEEQualificationByTestDate')
        .mockResolvedValue(null);
      const createLEEQualification = jest
        .spyOn(leeQualService, 'createLEEQualification')
        .mockResolvedValue(returnedLEEQualification);
      await leeQualService.importLEEQualification(
        locId,
        qualId,
        [payload],
        userId,
      );
      expect(getLEEQualificationByTestDate).toHaveBeenCalledWith(
        locId,
        qualId,
        payload.qualificationTestDate,
      );
      expect(createLEEQualification).toHaveBeenCalled;
    });

    it('should update LEEQualification if exists', async () => {
      const getLEEQualificationByTestDate = jest
        .spyOn(leeQualService, 'getLEEQualificationByTestDate')
        .mockResolvedValue(returnedLEEQualification);
      const updateLEEQualification = jest
        .spyOn(leeQualService, 'updateLEEQualification')
        .mockResolvedValue(returnedLEEQualification);
      await leeQualService.importLEEQualification(
        locId,
        qualId,
        [payload],
        userId,
      );
      expect(getLEEQualificationByTestDate).toHaveBeenCalledWith(
        locId,
        qualId,
        payload.qualificationTestDate,
      );
      expect(updateLEEQualification).toHaveBeenCalled;
    });
  });
});
