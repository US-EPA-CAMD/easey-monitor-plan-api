import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorDefaultWorkspaceService', () => {
  let service: MonitorDefaultWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        MonitorDefaultWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorDefaultWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorDefaultMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorDefaultWorkspaceService>(
      MonitorDefaultWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDefaults', () => {
    it('should return array of location defaults', async () => {
      const result = await service.getDefaults(null);
      expect(result).toEqual('');
    });
  });
});
