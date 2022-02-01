import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { HttpModule } from '@nestjs/axios';

import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemComponentWorkspaceModule } from '../system-component-workspace/system-component.module';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorSystemWorkspaceService', () => {
  let service: MonitorSystemWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule, SystemComponentWorkspaceModule],
      providers: [
        MonitorSystemWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSystemMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorSystemWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSystems', () => {
    it('should return array of monitor systems', async () => {
      const result = await service.getSystems(null);
      expect(result).toEqual('');
    });
  });
});
