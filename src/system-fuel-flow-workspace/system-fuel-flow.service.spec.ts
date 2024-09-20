import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemFuelFlow } from '../entities/workspace/system-fuel-flow.entity';
import {
  SystemFuelFlowBaseDTO,
  SystemFuelFlowDTO,
} from '../dtos/system-fuel-flow.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const FUEL_FLOW_ID = 'FUEL_FLOW_ID';
const SYS_ID = 'SYS_ID';
const MON_SYS_RECORD_ID = 'MON_SYS_RECORD_ID';
const LOC_ID = 'LOC_ID';
const USER_ID = 'USER_ID';
const DTO = new SystemFuelFlowDTO();
const PAYLOAD = new SystemFuelFlowBaseDTO();
const ENTITY = new SystemFuelFlow();

const mockRepository = () => ({
  getFuelFlows: jest.fn().mockResolvedValue([ENTITY]),
  getFuelFlow: jest.fn().mockResolvedValue(ENTITY),
  create: jest.fn().mockResolvedValue(ENTITY),
  save: jest.fn(),
  getFuelFlowByBeginOrEndDate: jest.fn().mockResolvedValue(ENTITY),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(DTO),
  many: jest.fn().mockResolvedValue([DTO]),
});

describe('SystemFuelFlowWorkspaceService', () => {
  let service: SystemFuelFlowWorkspaceService;
  let repository: SystemFuelFlowWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        SystemFuelFlowWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: SystemFuelFlowWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: SystemFuelFlowMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(SystemFuelFlowWorkspaceService);
    repository = module.get<SystemFuelFlowWorkspaceRepository>(
      SystemFuelFlowWorkspaceRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFuelFlows', () => {
    it('should return array of system fuel flows', async () => {
      const result = await service.getFuelFlows(null);
      expect(result).toEqual([DTO]);
    });
  });

  describe('getFuelFlow', () => {
    it('Should return a SystemFuelFlow when repo finds one matching the ID', async () => {
      const result = await service.getFuelFlow(FUEL_FLOW_ID);
      expect(result).toEqual(ENTITY);
    });

    it('Should throw an error when repo does not find a SystemFuelFlow matching the ID', async () => {
      let error = false;
      jest.spyOn(repository, 'getFuelFlow').mockResolvedValueOnce(null);

      try {
        await service.getFuelFlow(FUEL_FLOW_ID);
      } catch (e) {
        error = true;
      }

      expect(error).toEqual(true);
    });
  });

  describe('createFuelFlow', () => {
    it('Should create a new Entity and return a DTO mapped from it', async () => {
      const result = await service.createFuelFlow({
        monitoringSystemRecordId: MON_SYS_RECORD_ID,
        payload: PAYLOAD,
        locationId: LOC_ID,
        userId: USER_ID,
      });
      expect(result).toEqual(DTO);
    });
  });

  describe('updateFuelFlow', () => {
    it('Should update an existing Entity and return a DTO mapped from it', async () => {
      const result = await service.updateFuelFlow({
        fuelFlowId: FUEL_FLOW_ID,
        payload: PAYLOAD,
        locationId: LOC_ID,
        userId: USER_ID,
      });
      expect(result).toEqual(DTO);
    });
  });

  describe('importFuelFlow', () => {
    it('', async () => {
      const result = await service.importFuelFlow(
        LOC_ID,
        SYS_ID,
        [PAYLOAD],
        USER_ID,
      );
      expect(result).toEqual([true]);
    });
  });
});
