import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationService } from './monitor-location.service';
import { MonitorLocationRepository } from './monitor-location.repository';
import { MonitorLocation } from '../entities/monitor-location.entity';

const locId = '6';

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new MonitorLocation()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('MonitorLocationService', () => {
  let service: MonitorLocationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotFoundException],
      providers: [
        MonitorLocationService,
        {
          provide: MonitorLocationRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorLocationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLoads', () => {
    it('should return array of monitor loads', async () => {
      const result = await service.getLocation(locId);
      expect(result).toEqual({});
    });
  });
});
