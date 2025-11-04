import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitStackConfigurationChecksService } from '../unit-stack-configuration-workspace/unit-stack-configuration-checks.service';
import { MonitorPlanChecksService } from './monitor-plan-checks.service';
import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MatsMethodChecksService } from '../mats-method-workspace/mats-method-checks.service';
import { UnitControlChecksService } from '../unit-control-workspace/unit-control-checks.service';
import { MonitorSystemCheckService } from '../monitor-system-workspace/monitor-system-checks.service';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UnitControlBaseDTO } from '../dtos/unit-control.dto';
import { UpdateComponentBaseDTO } from '../dtos/component.dto';
import { UpdateMonitorSystemDTO } from '../dtos/monitor-system.dto';
import { SystemComponentBaseDTO } from '../dtos/system-component.dto';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { MonitorSpanBaseDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanChecksService } from '../monitor-span-workspace/monitor-span-checks.service';
import { UnitStackConfigurationBaseDTO } from '../dtos/unit-stack-configuration.dto';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const payload = new UpdateMonitorPlanDTO();
const location = new UpdateMonitorLocationDTO();
location.unitId = '51';
location.stackPipeId = null;
const matsMethod = new MatsMethodBaseDTO();
const unitControl = new UnitControlBaseDTO();
const component = new UpdateComponentBaseDTO();
const monitorSystem = new UpdateMonitorSystemDTO();
const systemComponent = new SystemComponentBaseDTO();
const monitorSpan = new MonitorSpanBaseDTO();
const unitStackConfiguration = new UnitStackConfigurationBaseDTO();

monitorSystem.monitoringSystemComponentData = [systemComponent];
location.monitoringSystemData = [monitorSystem];
location.unitControlData = [unitControl];
location.componentData = [component];
location.supplementalMATSMonitoringMethodData = [matsMethod];
payload.monitoringLocationData = [location];
location.monitoringSpanData = [monitorSpan];
payload.unitStackConfigurationData = [unitStackConfiguration];

const returnLocationRunChecks = [
  {
    unitId: '51',
    locationId: '1',
    stackPipeId: null,
  },
];

describe('Monitor Plan Checks Service Test', () => {
  let service: MonitorPlanChecksService;
  let matsMethodChecksService: MatsMethodChecksService;
  let unitControlChecksService: UnitControlChecksService;
  let componentCheckService: ComponentCheckService;
  let monitorSystemCheckService: MonitorSystemCheckService;
  let monitorSpanCheckService: MonitorSpanChecksService;
  let unitStackConfigurationChecksService: UnitStackConfigurationChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorPlanChecksService,
        {
          provide: MonitorLocationChecksService,
          useFactory: () => ({
            runChecks: jest
              .fn()
              .mockResolvedValue([returnLocationRunChecks, []]),
          }),
        },
        {
          provide: MatsMethodChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: UnitControlChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: ComponentCheckService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: MonitorSystemCheckService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: MonitorSpanChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: UnitStackConfigurationChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    service = module.get(MonitorPlanChecksService);
    matsMethodChecksService = module.get(MatsMethodChecksService);
    unitControlChecksService = module.get(UnitControlChecksService);
    componentCheckService = module.get(ComponentCheckService);
    monitorSystemCheckService = module.get(MonitorSystemCheckService);
    monitorSpanCheckService = module.get(MonitorSpanChecksService);
    unitStackConfigurationChecksService = module.get(
      UnitStackConfigurationChecksService,
    );
  });

  describe('RunChecks', () => {
    it('Should Call Children.runChecks functions', async () => {
      await service.runChecks(payload);
      expect(matsMethodChecksService.runChecks).toHaveBeenCalled();
      expect(unitControlChecksService.runChecks).toHaveBeenCalled();
      expect(componentCheckService.runChecks).toHaveBeenCalled();
      expect(monitorSystemCheckService.runChecks).toHaveBeenCalled();
      expect(monitorSpanCheckService.runChecks).toHaveBeenCalled();
      expect(unitStackConfigurationChecksService.runChecks).toHaveBeenCalled();
        });
      });

  // Tests Location lookup with anyOf schema compliance
  describe('Location Lookup - anyOf Schema Compliance', () => {
    const mockLocationIdentifiers = [
      { locationId: 'LOC1', unitId: '3', stackPipeId: null },
      { locationId: 'LOC2', unitId: null, stackPipeId: 'CS1' },
      { locationId: 'LOC3', unitId: '4', stackPipeId: 'CS2' },
    ];

    it('should find location with unitId only', async () => {
      const testPayload = new UpdateMonitorPlanDTO();
      testPayload.unitStackConfigurationData = [];

      const testLocation = new UpdateMonitorLocationDTO();
      testLocation.unitId = '3';
      testLocation.stackPipeId = null;
      testPayload.monitoringLocationData = [testLocation];

      // Mock the service to return the test location identifiers
      const mockService = {
        runChecks: jest.fn().mockResolvedValue([mockLocationIdentifiers, []]),
      };

      const module = await Test.createTestingModule({
        imports: [LoggerModule],
        providers: [
          MonitorPlanChecksService,
          { provide: MonitorLocationChecksService, useValue: mockService },
          { provide: MatsMethodChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitControlChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: ComponentCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSystemCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSpanChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitStackConfigurationChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
        ],
      }).compile();

      const testService = module.get(MonitorPlanChecksService);

      // Should not throw an error
      await expect(testService.runChecks(testPayload)).resolves.not.toThrow();
    });

    it('should find location with stackPipeId only', async () => {
      const testPayload = new UpdateMonitorPlanDTO();
      testPayload.unitStackConfigurationData = [];

      const testLocation = new UpdateMonitorLocationDTO();
      testLocation.unitId = null;
      testLocation.stackPipeId = 'CS1';
      testPayload.monitoringLocationData = [testLocation];

      const mockService = {
        runChecks: jest.fn().mockResolvedValue([mockLocationIdentifiers, []]),
      };

      const module = await Test.createTestingModule({
        imports: [LoggerModule],
        providers: [
          MonitorPlanChecksService,
          { provide: MonitorLocationChecksService, useValue: mockService },
          { provide: MatsMethodChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitControlChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: ComponentCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSystemCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSpanChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitStackConfigurationChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
        ],
      }).compile();

      const testService = module.get(MonitorPlanChecksService);

      await expect(testService.runChecks(testPayload)).resolves.not.toThrow();
    });

    it('should find location with both identifiers', async () => {
      const testPayload = new UpdateMonitorPlanDTO();
      testPayload.unitStackConfigurationData = [];

      const testLocation = new UpdateMonitorLocationDTO();
      testLocation.unitId = '4';
      testLocation.stackPipeId = 'CS2';
      testPayload.monitoringLocationData = [testLocation];

      const mockService = {
        runChecks: jest.fn().mockResolvedValue([mockLocationIdentifiers, []]),
      };

      const module = await Test.createTestingModule({
        imports: [LoggerModule],
        providers: [
          MonitorPlanChecksService,
          { provide: MonitorLocationChecksService, useValue: mockService },
          { provide: MatsMethodChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitControlChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: ComponentCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSystemCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSpanChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitStackConfigurationChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
        ],
      }).compile();

      const testService = module.get(MonitorPlanChecksService);

      await expect(testService.runChecks(testPayload)).resolves.not.toThrow();
    });

    it('should throw error when no location found', async () => {
      const testPayload = new UpdateMonitorPlanDTO();
      testPayload.unitStackConfigurationData = [];

      const testLocation = new UpdateMonitorLocationDTO();
      testLocation.unitId = '999';
      testLocation.stackPipeId = null;
      testPayload.monitoringLocationData = [testLocation];

      const mockService = {
        runChecks: jest.fn().mockResolvedValue([mockLocationIdentifiers, []]),
      };

      const module = await Test.createTestingModule({
        imports: [LoggerModule],
        providers: [
          MonitorPlanChecksService,
          { provide: MonitorLocationChecksService, useValue: mockService },
          { provide: MatsMethodChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitControlChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: ComponentCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSystemCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSpanChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitStackConfigurationChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
        ],
      }).compile();

      const testService = module.get(MonitorPlanChecksService);

      await expect(testService.runChecks(testPayload)).rejects.toThrow(BadRequestException);
    });

    it('should handle empty location identifiers', async () => {
      const testPayload = new UpdateMonitorPlanDTO();
      testPayload.unitStackConfigurationData = [];

      const testLocation = new UpdateMonitorLocationDTO();
      testLocation.unitId = '3';
      testLocation.stackPipeId = null;
      testPayload.monitoringLocationData = [testLocation];

      const mockService = {
        runChecks: jest.fn().mockResolvedValue([[], []]), // Empty location identifiers
      };

      const module = await Test.createTestingModule({
        imports: [LoggerModule],
        providers: [
          MonitorPlanChecksService,
          { provide: MonitorLocationChecksService, useValue: mockService },
          { provide: MatsMethodChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitControlChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: ComponentCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSystemCheckService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: MonitorSpanChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
          { provide: UnitStackConfigurationChecksService, useValue: { runChecks: jest.fn().mockResolvedValue([]) } },
        ],
      }).compile();

      const testService = module.get(MonitorPlanChecksService);

      await expect(testService.runChecks(testPayload)).rejects.toThrow(BadRequestException);
    });
  });
});
