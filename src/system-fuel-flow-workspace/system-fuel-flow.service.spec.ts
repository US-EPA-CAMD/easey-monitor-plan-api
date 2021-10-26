import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';

const mockRepository = () => ({
  getFuelFlows: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('SystemFuelFlowWorkspaceService', () => {
  let service: SystemFuelFlowWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        SystemFuelFlowWorkspaceService,
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFuelFlows', () => {
    it('should return array of system fuel flows', async () => {
      const result = await service.getFuelFlows(null);
      expect(result).toEqual('');
    });
  });
});
