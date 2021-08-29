import { Test, TestingModule } from '@nestjs/testing';

import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorAttributeWorkspaceService', () => {
  let service: MonitorAttributeWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorAttributeWorkspaceService,
        {
          provide: MonitorAttributeWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorAttributeMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorAttributeWorkspaceService>(
      MonitorAttributeWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAttributes', () => {
    it('should return array of location attributes', async () => {
      const result = await service.getAttributes(null);
      expect(result).toEqual('');
    });
  });
});
