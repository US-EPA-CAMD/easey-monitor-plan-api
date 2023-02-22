import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafWorkspaceService } from './duct-waf.service';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { DuctWaf } from '../entities/workspace/duct-waf.entity';
import { DuctWafBaseDTO, DuctWafDTO } from '../dtos/duct-waf.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const ENTITY = new DuctWaf();
const DTO = new DuctWafDTO();
const PAYLOAD = new DuctWafBaseDTO();
const LOC_ID = 'A LOCATION ID';
const DUCT_WAF_ID = 'A DUCT WAF ID';
const USER_ID = 'A USER ID';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
  findOne: jest.fn().mockResolvedValue(ENTITY),
  create: jest.fn(),
  save: jest.fn(),
  getDuctWafByLocIdBDateBHourWafValue: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(DTO),
  many: jest.fn().mockResolvedValue([DTO]),
});

describe('DuctWafWorkspaceService', () => {
  let service: DuctWafWorkspaceService;
  let repository: DuctWafWorkspaceRepository;

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
    repository = module.get<DuctWafWorkspaceRepository>(
      DuctWafWorkspaceRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDuctWafs', () => {
    it('should return array of duct wafs', async () => {
      const result = await service.getDuctWafs(LOC_ID);
      expect(result).toEqual([DTO]);
    });
  });

  describe('getDuctWaf', () => {
    it('Should return one duct waf', async () => {
      const result = await service.getDuctWaf(DUCT_WAF_ID);
      expect(result).toEqual(ENTITY);
    });

    it('Should throw a NOT FOUND error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let error = false;
      try {
        await service.getDuctWaf(DUCT_WAF_ID);
      } catch (e) {
        error = true;
      }

      expect(error).toBe(true);
    });
  });

  describe('createDuctWaf', () => {
    it('Should return a new DTO created from the saved Entity', async () => {
      const result = await service.createDuctWaf(
        LOC_ID,
        new DuctWafBaseDTO(),
        USER_ID,
      );
      expect(result).toEqual(DTO);
    });
  });

  describe('updateDuctWaf', () => {
    it('Should return an updated DTO created from the saved Entity', async () => {
      const result = await service.updateDuctWaf(
        LOC_ID,
        DUCT_WAF_ID,
        new DuctWafBaseDTO(),
        USER_ID,
      );
      expect(result).toEqual(DTO);
    });
  });

  describe('importDuctWaf', () => {
    it('Should return true if DTOs are imported successfully', async () => {
      const result = await service.importDuctWaf(LOC_ID, [PAYLOAD], USER_ID);
      expect(result).toEqual(true);
    });
  });
});
