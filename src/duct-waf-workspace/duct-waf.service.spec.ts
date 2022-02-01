import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafWorkspaceService } from './duct-waf.service';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

describe('DuctWafWorkspaceService', () => {
  let service: DuctWafWorkspaceService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDuctWafs', () => {
    it('should return array of duct wafs', async () => {
      const result = await service.getDuctWafs(null);
      expect(result).toEqual('');
    });
  });
});
