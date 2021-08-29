import { Test, TestingModule } from '@nestjs/testing';

import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeService } from './monitor-attribute.service';
import { MonitorAttributeRepository } from './monitor-attribute.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorAttributeService', () => {
  let service: MonitorAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorAttributeService,
        {
          provide: MonitorAttributeRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorAttributeMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorAttributeService>(MonitorAttributeService);
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
