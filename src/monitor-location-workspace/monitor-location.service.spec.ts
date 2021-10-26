import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceService } from './monitor-location.service';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorLocation } from '../entities/monitor-location.entity';

const locId = '6';

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new MonitorLocation()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('MonitorLocationWorkspaceService', () => {
  let service: MonitorLocationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotFoundException, LoggerModule],
      providers: [
        MonitorLocationWorkspaceService,
        {
          provide: MonitorLocationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorLocationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorLocationWorkspaceService);
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
