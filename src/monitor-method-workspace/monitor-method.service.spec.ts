import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodWorkspaceService } from './monitor-method.service';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorMethodWorkspaceService', () => {
  let service: MonitorMethodWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        MonitorMethodWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorMethodWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorMethodMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorMethodWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMethods', () => {
    it('should return array of monitor methods', async () => {
      const result = await service.getMethods(null);
      expect(result).toEqual('');
    });
  });
});
