import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationService } from './monitor-location.service';
import { MonitorLocationRepository } from './monitor-location.repository';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { UnitStackConfigurationService } from '../unit-stack-configuration/unit-stack-configuration.service';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationDTO } from '../dtos/unit-stack-configuration.dto';
import { StackPipe } from '../entities/stack-pipe.entity';

const locId = '6';
const uscDto = new UnitStackConfigurationDTO();

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new MonitorLocation()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

const mockUscService = () => ({
  getUnitStackRelationships: jest.fn().mockResolvedValue([uscDto]),
});

describe('MonitorLocationService', () => {
  let service: MonitorLocationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotFoundException, LoggerModule],
      providers: [
        MonitorLocationService,
        MonitorLocationRepository,
        MonitorLocationMap,
        {
          provide: UnitStackConfigurationService,
          useFactory: mockUscService,
        },
        UnitStackConfigurationRepository,
        UnitStackConfigurationMap,
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

  describe('tests getLocation method', () => {
    it('should return a monitor location object', async () => {
      const result = await service.getLocation(locId);
      expect(result).toEqual({});
    });
  });

  describe('tests getLocationRelationships', () => {
    it('should return an array of monitor locations', async () => {
      const monLoc = new MonitorLocation();
      monLoc.stackPipe = new StackPipe();
      monLoc.stackPipe.id = '1';
      jest.spyOn(service, 'getLocationEntity').mockResolvedValue(monLoc);

      const result = await service.getLocationRelationships(locId);
      expect(result).toEqual([uscDto]);
    });
  });
});
