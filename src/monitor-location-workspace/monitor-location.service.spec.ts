import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceService } from './monitor-location.service';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitService } from '../unit/unit.service';
import { StackPipeService } from '../stack-pipe/stack-pipe.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UnitCapacityWorkspaceService } from '../unit-capacity-workspace/unit-capacity.service';
import { UnitControlWorkspaceService } from '../unit-control-workspace/unit-control.service';
import { UnitFuelWorkspaceService } from '../unit-fuel-workspace/unit-fuel.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MonitorSystemWorkspaceService } from '../monitor-system-workspace/monitor-system.service';
import { MonitorFormulaWorkspaceService } from '../monitor-formula-workspace/monitor-formula.service';
import { MatsMethodWorkspaceService } from '../mats-method-workspace/mats-method.service';
import { MonitorMethodWorkspaceService } from '../monitor-method-workspace/monitor-method.service';
import { DuctWafWorkspaceService } from '../duct-waf-workspace/duct-waf.service';
import { MonitorSpanWorkspaceService } from '../monitor-span-workspace/monitor-span.service';
import { MonitorDefaultWorkspaceService } from '../monitor-default-workspace/monitor-default.service';
import { MonitorLoadWorkspaceService } from '../monitor-load-workspace/monitor-load.service';
import { MonitorAttributeWorkspaceService } from '../monitor-attribute-workspace/monitor-attribute.service';

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
  getUnitStackConfigsByLocationIds: jest.fn().mockResolvedValue([]),
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
        UnitStackConfigurationMap,
        {
          provide: UnitStackConfigurationWorkspaceService,
          useFactory: mockUscService,
        },
        {
          provide: UnitService,
          useFactory: () => ({}),
        },
        {
          provide: StackPipeService,
          useFactory: () => ({}),
        },
        {
          provide: ComponentWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: UnitCapacityWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: UnitControlWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: UnitFuelWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorQualificationWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorSystemWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorFormulaWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MatsMethodWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorMethodWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: DuctWafWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorSpanWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorDefaultWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorLoadWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorAttributeWorkspaceService,
          useFactory: () => ({}),
        },
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
