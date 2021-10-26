import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodWorkspaceService } from './monitor-method.service';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorMethodWorkspaceService', () => {
  let service: MonitorMethodWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorMethodWorkspaceService,
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
