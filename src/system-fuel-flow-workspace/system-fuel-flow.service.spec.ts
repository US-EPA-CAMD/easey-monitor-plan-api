import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowBaseDTO, SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const mockEntity = new SystemFuelFlow();
const mockPayload = new SystemFuelFlowBaseDTO();
const mockDTO = new SystemFuelFlowDTO();
const monitoringSystemId = 'testMonSysId';
const fuelFlowId = 'testFuelFlowId';
const locationId = 'testLocationid';
const userId = 'testUserId';

let mockRepository = () => ({
  getFuelFlows: jest.fn().mockResolvedValue(''),
  getFuelFlow: jest.fn().mockResolvedValue(mockEntity),
  save: jest.fn().mockResolvedValue(mockEntity),
  create: jest.fn().mockResolvedValue(mockEntity),
  getFuelFlowByBeginOrEndDate: jest.fn().mockResolvedValue(mockEntity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(mockDTO),
  many: jest.fn().mockResolvedValue([mockDTO]),
});

describe('SystemFuelFlowWorkspaceService', () => {
  let service: SystemFuelFlowWorkspaceService;
  let repo: SystemFuelFlowWorkspaceRepository;

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

    service = module.get<SystemFuelFlowWorkspaceService>(SystemFuelFlowWorkspaceService);
    repo = module.get<SystemFuelFlowWorkspaceRepository>(SystemFuelFlowWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFuelFlows', () => {
    it('should return array of system fuel flows', async () => {
      const result = await service.getFuelFlows(null);
      expect(result).toEqual([mockDTO]);
    });
  });

  describe('getFuelFlow', () => {
    it('should return FuelFlow if Id is valid', async () => {
      const result = await service.getFuelFlow('abc123');
      expect(result).toEqual(mockEntity);
    });

    it('should throw Not Found Error if Id is invalid', async () => {
      jest.spyOn(repo, 'getFuelFlow').mockResolvedValueOnce(null);
      await expect(service.getFuelFlow('def456')).rejects.toThrow();
    });
  })

  describe('createFuelFlow', () => {
    it('should save payload and return an entity', async () => {
      const result = await service.createFuelFlow(
        monitoringSystemId, mockPayload, locationId, userId, false
      );
      expect(result).toEqual(mockDTO);
    })
  });

  describe('updateFuelFlow', () => {
    it('should save payload and return an entity', async () => {
      const result = await service.updateFuelFlow(
        fuelFlowId, mockPayload, locationId, userId, false
      )
      expect(result).toEqual(mockDTO);
    });
  });

  describe('import', () => {
    it('should update entity to match payload', async () => {
      await service.importFuelFlow(
        locationId, monitoringSystemId, [mockPayload], userId
      );
    })

    it('should create new entity from payload', async () => {
      jest.spyOn(repo, 'getFuelFlowByBeginOrEndDate').mockResolvedValueOnce(null);
      await service.importFuelFlow(
        locationId, monitoringSystemId, [mockPayload], userId
      );
    })
  });
});
