import { Test, TestingModule } from '@nestjs/testing';
import {} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceService } from './monitor-location.service';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorLocation } from '../entities/monitor-location.entity';
// import { MonitorAttributeWorkspaceModule } from '../monitor-attribute-workspace/monitor-attribute.module';
// import { UnitCapacityWorkspaceModule } from '../unit-capacity-workspace/unit-capacity.module';
// import { UnitControlWorkspaceModule } from '../unit-control-workspace/unit-control.module';
// import { UnitFuelWorkspaceModule } from '../unit-fuel-workspace/unit-fuel.module';
// import { MonitorMethodWorkspaceModule } from '../monitor-method-workspace/monitor-method.module';
// import { MatsMethodWorkspaceModule } from '../mats-method-workspace/mats-method.module';
// import { MonitorFormulaWorkspaceModule } from '../monitor-formula-workspace/monitor-formula.module';
// import { MonitorDefaultWorkspaceModule } from '../monitor-default-workspace/monitor-default.module';
// import { MonitorSpanWorkspaceModule } from '../monitor-span-workspace/monitor-span.module';
// import { DuctWafWorkspaceModule } from '../duct-waf-workspace/duct-waf.module';
// import { MonitorLoadWorkspaceModule } from '../monitor-load-workspace/monitor-load.module';
// import { ComponentWorkspaceModule } from '../component-workspace/component.module';
// import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system.module';
// import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
// import { UnitStackConfigurationWorkspaceModule } from '../unit-stack-configuration-workspace/unit-stack-configuration.module';

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
      imports: [
        // MonitorAttributeWorkspaceModule,
        // UnitCapacityWorkspaceModule,
        // UnitControlWorkspaceModule,
        // UnitFuelWorkspaceModule,
        // MonitorMethodWorkspaceModule,
        // MatsMethodWorkspaceModule,
        // MonitorFormulaWorkspaceModule,
        // MonitorDefaultWorkspaceModule,
        // MonitorSpanWorkspaceModule,
        // DuctWafWorkspaceModule,
        // MonitorLoadWorkspaceModule,
        // ComponentWorkspaceModule,
        // MonitorSystemWorkspaceModule,
        // MonitorQualificationWorkspaceModule,
        // UnitStackConfigurationWorkspaceModule,
        LoggerModule,
        HttpModule,
      ],
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
