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
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');
jest.mock('../monitor-qualification-workspace/monitor-qualification.service');

const returnedLEEQualification: LEEQualificationDTO = new LEEQualificationDTO();
const leeQual = new LEEQualification();

const payload = new LEEQualificationBaseDTO();

let qual = new MonitorQualificationDTO();
qual.qualificationTypeCode = 'LEE';

const mockQualService = () => ({
  getQualification: jest.fn().mockResolvedValue(qual),
});

const mockRepository = () => ({
  getLEEQualifications: jest.fn().mockResolvedValue([leeQual]),
  getLEEQualification: jest.fn().mockResolvedValue(leeQual),
  getLEEQualificationByTestDate: jest.fn().mockResolvedValue(leeQual),
  find: jest.fn().mockResolvedValue([returnedLEEQualification]),
  findOne: jest.fn().mockResolvedValue(leeQual),
  create: jest.fn().mockResolvedValue(leeQual),
  save: jest.fn().mockResolvedValue(leeQual),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(returnedLEEQualification),
  many: jest.fn().mockResolvedValue([returnedLEEQualification]),
});

describe('LEEQualificationService', () => {
  let service: LEEQualificationWorkspaceService;
  let repository: LEEQualificationWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LEEQualificationWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorQualificationWorkspaceService,
          useFactory: mockQualService,
        },
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

    service = module.get<LEEQualificationWorkspaceService>(
      LEEQualificationWorkspaceService,
    );
    repository = module.get<LEEQualificationWorkspaceRepository>(
      LEEQualificationWorkspaceRepository,
    );
  });

  describe('getLEEQualifications', () => {
    it('should return array of LEE qualifications', async () => {
      const result = await service.getLEEQualifications('1', '1');
      expect(result).toEqual([leeQual]);
    });
  });

  describe('getLEEQualification', () => {
    it('should return LEE qualification for a specific qualification ID and location ID', async () => {
      const result = await service.getLEEQualification('1', '1', '1');
      expect(result).toEqual(leeQual);
    });

    it('should throw error when LEE qualification not found', async () => {
      jest.spyOn(repository, 'getLEEQualification').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getLEEQualification('1', '1', '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createLEEQualification', () => {
    it('creates a LEE qualification for a specific qualification ID', async () => {
      const result = await service.createLEEQualification({
        locationId: '1',
        qualId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(returnedLEEQualification);
    });
  });

  describe('updateLEEQualification', () => {
    it('updates a LEE qualification for a specific qualification ID and location ID', async () => {
      jest.spyOn(repository, 'getLEEQualification').mockResolvedValue(leeQual);

      const result = await service.updateLEEQualification({
        locationId: '1',
        qualId: '1',
        pctQualId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(returnedLEEQualification);
    });
  });

  describe('importLEEQualification', () => {
    it('should create LEEQualification if not exists', async () => {
      jest
        .spyOn(repository, 'getLEEQualificationByTestDate')
        .mockResolvedValue(null);
      const result = await service.importLEEQualification(
        '1',
        '1',
        [payload],
        'testUser',
      );
      expect(result).toEqual(true);
    });

    it('should update LEEQualification if exists', async () => {
      jest
        .spyOn(repository, 'getLEEQualificationByTestDate')
        .mockResolvedValue(leeQual);

      const result = await service.importLEEQualification(
        '1',
        '1',
        [payload],
        'testUser',
      );
      expect(result).toEqual(true);
    });
  });
});
