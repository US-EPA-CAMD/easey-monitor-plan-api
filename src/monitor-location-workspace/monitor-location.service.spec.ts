import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceService } from './monitor-location.service';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';

const locId = '6';

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new MonitorLocation()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

const mockUscService = () => ({
  getUnitStackRelationships: jest.fn().mockResolvedValue([]),
});

describe('MonitorLocationWorkspaceService', () => {
  let service: MonitorLocationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotFoundException, LoggerModule],
      providers: [
        MonitorLocationWorkspaceService,
        MonitorLocationWorkspaceRepository,
        MonitorLocationMap,
        {
          provide: UnitStackConfigurationWorkspaceService,
          useFactory: mockUscService,
        },
        UnitStackConfigurationRepository,
        UnitStackConfigurationMap,
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

  describe('tests getLocation method', () => {
    it('should return a monitor location object', async () => {
      const result = await service.getLocation(locId);
      expect(result).toEqual({});
    });
  });

  describe('tests getLocationRelationships', () => {
    it('should return an array of monitor locations', async () => {
      const result = await service.getLocationRelationships(locId);
      expect(result).toEqual([]);
    });
  });
});
