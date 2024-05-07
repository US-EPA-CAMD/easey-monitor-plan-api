import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeService } from './monitor-attribute.service';
import { MonitorAttributeRepository } from './monitor-attribute.repository';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

const locId = 'string';

describe('MonitorAttributeService', () => {
  let service: MonitorAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
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
      const result = await service.getAttributes(locId);
      expect(result).toEqual('');
    });
  });
});
