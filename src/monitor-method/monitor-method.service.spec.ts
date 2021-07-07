import { Test, TestingModule } from '@nestjs/testing';

import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodService } from './monitor-method.service';
import { MonitorMethodRepository } from './monitor-method.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorMethodService', () => {
  let service: MonitorMethodService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorMethodService,
        {
          provide: MonitorMethodRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorMethodMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorMethodService);
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
