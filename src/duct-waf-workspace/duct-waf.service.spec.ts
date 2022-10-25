import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafWorkspaceService } from './duct-waf.service';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWaf } from '../entities/workspace/duct-waf.entity';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locationId = 'testLocationId';
const ductWafId = 'testDuctWafId';
const userId = 'testUserId';
const mockDTO = new DuctWafDTO();
const mockEntity = new DuctWaf();

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(mockEntity),
  find: jest.fn().mockResolvedValue([mockEntity]),
  create: jest.fn().mockResolvedValue(mockEntity),
  save: jest.fn().mockResolvedValue(mockEntity),
  getDuctWafByLocIdBDateBHourWafValue: jest.fn().mockResolvedValue(mockEntity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(mockDTO),
  many: jest.fn().mockResolvedValue([mockDTO]),
});

describe('DuctWafWorkspaceService', () => {
  let service: DuctWafWorkspaceService;
  let repo: DuctWafWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        DuctWafWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: DuctWafWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: DuctWafMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<DuctWafWorkspaceService>(DuctWafWorkspaceService);
    repo = module.get<DuctWafWorkspaceRepository>(DuctWafWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDuctWafs', () => {
    it('should return array of duct wafs', async () => {
      const result = await service.getDuctWafs(null);
      expect(result).toEqual([mockDTO]);
    });
  });

  describe('getDuctWaf', () => {
    it('Should return a Duct Waf if the Id is valid', async () => {
      const result = await service.getDuctWaf(ductWafId);
      expect(result).toEqual(mockDTO);
    });

    it('Should throw an error if the Id is invalid', async () => {
      jest.spyOn(repo,'findOne').mockResolvedValueOnce(null);
      await expect(service.getDuctWaf('xxx')).rejects.toThrow();
    });
  });

  describe('createDuctWaf', () => {
    it('Should save a new DuctWaf entity', async () => {
      const result = await service.createDuctWaf(
        locationId, mockDTO, userId, false,
      )
      expect(result).toEqual(mockDTO);
    });
  });

  describe('updateDuctWaf', () => {
    it('Should update an existing DuctWaf entity', async () => {
      const result = await service.updateDuctWaf(
        locationId, ductWafId, mockDTO, userId, false
      )
      expect(result).toEqual(mockDTO);
    });
  });

  describe('importDuctWaf', () => {
    it('Should update an existing DuctWaf entity to match payload', async () => {
      const result = await service.importDuctWaf(
        locationId, [mockDTO], userId
      );
    });

    it('Should create a new entity to match payload', async () => {
      jest.spyOn(repo, 'getDuctWafByLocIdBDateBHourWafValue').mockResolvedValueOnce(undefined);
      const result = await service.importDuctWaf(
        locationId, [mockDTO], userId
      );
    });
  });
});
