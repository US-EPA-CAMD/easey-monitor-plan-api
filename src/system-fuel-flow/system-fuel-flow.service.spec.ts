import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlowService } from './system-fuel-flow.service';
import { SystemFuelFlowRepository } from './system-fuel-flow.repository';

const mockRepository = () => ({
  getFuelFlows: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('SystemFuelFlowService', () => {
  let service: SystemFuelFlowService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        SystemFuelFlowService,
        {
          provide: SystemFuelFlowRepository,
          useFactory: mockRepository,
        },
        {
          provide: SystemFuelFlowMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(SystemFuelFlowService);
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
