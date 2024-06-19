import { Test, TestingModule } from '@nestjs/testing';

import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';
import {
  CPMSQualificationBaseDTO,
  CPMSQualificationDTO,
} from '../dtos/cpms-qualification.dto';
import { CPMSQualification } from '../entities/workspace/cpms-qualification.entity';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');
jest.mock('../monitor-qualification-workspace/monitor-qualification.service');

const locId = '6';
const qualId = '1';
const cpmsQualId = 'some lme qualification id';
const userId = 'testuser';
const stackTestNumber = 'Test1234';

const cpmsQualificationDto: CPMSQualificationDTO = new CPMSQualificationDTO();
const cpmsQualification: CPMSQualification = new CPMSQualification();

const payload: CPMSQualificationBaseDTO = {
  qualificationDataYear: 2021,
  stackTestNumber: 'Test1234',
  operatingLimit: 10,
};

let qual = new MonitorQualificationDTO();
qual.qualificationTypeCode = 'CPMS';

const mockQualService = () => ({
  getQualification: jest.fn().mockResolvedValue(qual),
});

const mockRepository = () => ({
  getCPMSQualification: jest.fn().mockResolvedValue(cpmsQualification),
  getCPMSQualifications: jest.fn().mockResolvedValue([cpmsQualification]),
  getCPMSQualificationByStackTestNumber: jest
    .fn()
    .mockResolvedValue(cpmsQualification),
  create: jest.fn().mockResolvedValue(cpmsQualification),
  save: jest.fn().mockResolvedValue(cpmsQualification),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(cpmsQualificationDto),
  many: jest.fn().mockResolvedValue([cpmsQualificationDto]),
});

describe('CPMSQualificationWorkspaceService', () => {
  let service: CPMSQualificationWorkspaceService;
  let repository: CPMSQualificationWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CPMSQualificationWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorQualificationWorkspaceService,
          useFactory: mockQualService,
        },
        {
          provide: CPMSQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: CPMSQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<CPMSQualificationWorkspaceService>(
      CPMSQualificationWorkspaceService,
    );
    repository = module.get<CPMSQualificationWorkspaceRepository>(
      CPMSQualificationWorkspaceRepository,
    );
  });

  describe('getCPMSQualifications', () => {
    it('should return array of CPMS qualifications', async () => {
      const result = await service.getCPMSQualifications('1', '1');
      expect(result).toEqual([cpmsQualificationDto]);
    });
  });

  describe('getCPMSQualificationByStackTestNumber', () => {
    it('should return LEE qualification for a specific qualification ID , location ID and qualification data year', async () => {
      repository.getCPMSQualificationByStackTestNumber = jest
        .fn()
        .mockResolvedValue(cpmsQualification);
      const result = await service.getCPMSQualificationByStackTestNumber(
        locId,
        qualId,
        stackTestNumber,
      );
      expect(
        repository.getCPMSQualificationByStackTestNumber,
      ).toHaveBeenCalledWith(locId, qualId, stackTestNumber);
      expect(result).toEqual(cpmsQualificationDto);
    });
  });

  describe('createCPMSQualification', () => {
    it('creates a CPMS qualification for a specific qualification ID', async () => {
      const result = await service.createCPMSQualification({
        locationId: locId,
        qualId,
        payload,
        userId,
      });
      expect(result).toEqual(cpmsQualificationDto);
    });
  });

  describe('updateCPMSQualification', () => {
    it('updates a CPMS qualification for a specific qualification ID and location ID', async () => {
      const result = await service.updateCPMSQualification({
        locationId: locId,
        qualId,
        cpmsQualId,
        payload,
        userId,
      });
      expect(result).toEqual(cpmsQualificationDto);
    });
  });

  describe('importCPMSQualification', () => {
    it('should create CPMSQualification if not exists', async () => {
      const getCPMSQualificationByStackTestNumber = jest
        .spyOn(service, 'getCPMSQualificationByStackTestNumber')
        .mockResolvedValue(null);
      const createCPMSQualification = jest
        .spyOn(service, 'createCPMSQualification')
        .mockResolvedValue(cpmsQualificationDto);
      await service.importCPMSQualifications(
        locId,
        qualId,
        [payload],
        userId,
        undefined,
      );
      expect(getCPMSQualificationByStackTestNumber).toHaveBeenCalledWith(
        locId,
        qualId,
        payload.stackTestNumber,
        undefined,
      );
      expect(createCPMSQualification).toHaveBeenCalled;
    });

    it('should update CPMSQualification if exists', async () => {
      const getCPMSQualificationByStackTestNumber = jest
        .spyOn(service, 'getCPMSQualificationByStackTestNumber')
        .mockResolvedValue(cpmsQualificationDto);
      const updateCPMSQualification = jest
        .spyOn(service, 'updateCPMSQualification')
        .mockResolvedValue(cpmsQualificationDto);
      await service.importCPMSQualifications(
        locId,
        qualId,
        [payload],
        userId,
        undefined,
      );
      expect(getCPMSQualificationByStackTestNumber).toHaveBeenCalledWith(
        locId,
        qualId,
        payload.stackTestNumber,
        undefined,
      );
      expect(updateCPMSQualification).toHaveBeenCalled;
    });
  });
});
