import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafWorkspaceService } from './duct-waf.service';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { DuctWaf } from '../entities/workspace/duct-waf.entity';
import { DuctWafBaseDTO, DuctWafDTO } from '../dtos/duct-waf.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');
jest.mock('@us-epa-camd/easey-common/check-catalog');

const ENTITY = new DuctWaf();
const DTO = new DuctWafDTO();
const PAYLOAD = new DuctWafBaseDTO();
const LOC_ID = 'A LOCATION ID';
const DUCT_WAF_ID = 'A DUCT WAF ID';
const USER_ID = 'A USER ID';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
  findOneBy: jest.fn().mockResolvedValue(ENTITY),
  create: jest.fn(),
  save: jest.fn(),
  getDuctWafByLocIdBeginOrEndDate: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(DTO),
  many: jest.fn().mockResolvedValue([DTO]),
});

describe('DuctWafWorkspaceService', () => {
  let service: DuctWafWorkspaceService;
  let repository: DuctWafWorkspaceRepository;
  const KEY = 'Rectangular Duct WAF';

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
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

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
      const result = await service.createDuctWaf({
        locationId: LOC_ID,
        payload: new DuctWafBaseDTO(),
        userId: USER_ID,
      });
      expect(result).toEqual(DTO);
    });
  });

  describe('updateDuctWaf', () => {
    it('Should return an updated DTO created from the saved Entity', async () => {
      const result = await service.updateDuctWaf({
        locationId: LOC_ID,
        ductWafId: DUCT_WAF_ID,
        payload: new DuctWafBaseDTO(),
        userId: USER_ID,
      });
      expect(result).toEqual(DTO);
    });
  });

  describe('importDuctWaf', () => {
    it('Should return true if DTOs are imported successfully', async () => {
      const result = await service.importDuctWaf(LOC_ID, [PAYLOAD], USER_ID);
      expect(result).toEqual(true);
    });
  });

  describe('DEFAULT-96-A check', () => {
    const locationId = 'A LOCATION ID';
    const payload: DuctWafBaseDTO = {
      wafDeterminationDate: new Date('2023-01-01'),
      wafBeginDate: new Date('2023-01-01'),
      wafBeginHour: 0,
      wafMethodCode: 'METHOD1',
      wafValue: 1.0,
      numberOfTestRuns: 3,
      numberOfTraversePointsWAF: 12,
      numberOfTestPorts: 4,
      numberOfTraversePointsRef: 12,
      ductWidth: 2.0,
      ductDepth: 1.5,
      wafEndDate: new Date('2023-12-31'),
      wafEndHour: 23,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return DEFAULT-96-A error | wafBeginHour exist', async () => {
      const duplicateDuctWaf = new DuctWaf();
      duplicateDuctWaf.id = 'different-id';
      duplicateDuctWaf.locationId = locationId;
      duplicateDuctWaf.wafBeginDate = new Date('2023-01-01');
      duplicateDuctWaf.wafBeginHour = 0;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(duplicateDuctWaf);

      const result = await service['duplicateDuctWafChecks'](payload, locationId);

      expect(result).toBe(
        CheckCatalogService.formatResultMessage('DEFAULT-96-A', {
          fieldnames: 'wafBeginDate, wafBeginHour',
          recordtype: KEY
        })
      );
    });

    it('should return DEFAULT-96-A error | wafEndHour exist', async () => {
      const duplicateDuctWaf = new DuctWaf();
      duplicateDuctWaf.id = 'different-id';
      duplicateDuctWaf.locationId = locationId;
      duplicateDuctWaf.wafEndDate = new Date('2023-12-31');
      duplicateDuctWaf.wafEndHour = 23;

      jest.spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(duplicateDuctWaf);

      const result = await service['duplicateDuctWafChecks'](payload, locationId);

      expect(result).toBe(
        CheckCatalogService.formatResultMessage('DEFAULT-96-A', {
          fieldnames: 'wafEndDate, wafEndHour',
          recordtype: KEY
        })
      );
    });
  });
});
