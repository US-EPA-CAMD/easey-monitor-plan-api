import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { UpdateLMEQualificationDTO } from '../dtos/lme-qualification-update.dto';
import { LMEQualification } from '../entities/workspace/lme-qualification.entity';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';

const locId = '6';
const qualId = '1';
const lmeQualId = 'some lme qualification id';
const userId = 'testuser';

const returnedLMEQualifications: LMEQualificationDTO[] = [];
const returnedLMEQualification: LMEQualificationDTO = new LMEQualificationDTO();

const payload: UpdateLMEQualificationDTO = {
  qualificationDataYear: 2021,
  operatingHours: 10,
  so2Tons: 1.5,
  noxTons: 1.5,
};

const mockRepository = () => ({
  getLMEQualifications: jest.fn().mockResolvedValue(returnedLMEQualifications),
  getLMEQualification: jest.fn().mockResolvedValue(returnedLMEQualification),
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

    lmeQualService = module.get(LMEQualificationWorkspaceService);
    lmeQualRepository = module.get(LMEQualificationWorkspaceRepository);
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
});

