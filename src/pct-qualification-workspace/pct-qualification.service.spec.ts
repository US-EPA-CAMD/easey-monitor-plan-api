import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { PCTQualificationBaseDTO } from '../dtos/pct-qualification-update.dto';
import { PCTQualification } from '../entities/workspace/pct-qualification.entity';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';

const locId = '6';
const qualId = '1';
const pctQualId = 'some pct qualification id';
const userId = 'testuser';

const returnedPCTQualifications: PCTQualificationDTO[] = [];
const returnedPCTQualification: PCTQualificationDTO = new PCTQualificationDTO();

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

const mockRepository = () => ({
  getPCTQualifications: jest.fn().mockResolvedValue(returnedPCTQualifications),
  getPCTQualification: jest.fn().mockResolvedValue(returnedPCTQualification),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new PCTQualification()),
  create: jest.fn().mockResolvedValue(new PCTQualification()),
  save: jest.fn().mockResolvedValue(new PCTQualification()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('PCTQualificationService', () => {
  let loadService: PCTQualificationWorkspaceService;
  let loadRepository: PCTQualificationWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        PCTQualificationWorkspaceService,
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

    loadService = module.get(PCTQualificationWorkspaceService);
    loadRepository = module.get(PCTQualificationWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(loadService).toBeDefined();
  });

  describe('getPCTQualifications', () => {
    it('should return array of PCT qualifications', async () => {
      const result = await loadService.getPCTQualifications(locId, qualId);
      expect(result).toEqual([]);
    });
  });

  describe('getPCTQualification', () => {
    it('should return PCT qualification for a specific qualification ID and location ID', async () => {
      const result = await loadService.getPCTQualification(
        locId,
        qualId,
        pctQualId,
      );
      expect(result).toEqual({});
    });
  });

  describe('createPCTQualification', () => {
    it('creates a PCT qualification for a specific qualification ID', async () => {
      const result = await loadService.createPCTQualification(
        userId,
        locId,
        qualId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updatePCTQualification', () => {
    it('updates a PCT qualification for a specific qualification ID and location ID', async () => {
      const result = await loadService.updatePCTQualification(
        userId,
        locId,
        qualId,
        pctQualId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
