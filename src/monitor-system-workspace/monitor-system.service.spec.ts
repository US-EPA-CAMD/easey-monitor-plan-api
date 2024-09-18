import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { HttpModule } from '@nestjs/axios';

import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UpdateMonitorSystemDTO } from '../dtos/monitor-system.dto';
import { SystemComponentBaseDTO } from '../dtos/system-component.dto';
import { ComponentDTO, UpdateComponentBaseDTO } from '../dtos/component.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { SystemComponentWorkspaceService } from '../system-component-workspace/system-component.service';
import { SystemFuelFlowWorkspaceService } from '../system-fuel-flow-workspace/system-fuel-flow.service';
import { SystemFuelFlowBaseDTO } from '../dtos/system-fuel-flow.dto';
import { MonitorSystem } from '../entities/monitor-system.entity';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const monSys = new MonitorSystem();
const compRecord = new ComponentDTO();

const mockRepository = () => ({
  find: () => {
    return {};
  },
  findOneBy: () => {
    return {};
  },
});

const mockUsedIdRepo = () => ({
  findOne: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorSystemWorkspaceService', () => {
  let service: MonitorSystemWorkspaceService;
  let repository: MonitorSystemWorkspaceRepository;
  let usedIdRepo: UsedIdentifierRepository;
  let componentService: ComponentWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorSystemWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: ComponentWorkspaceService,
          useFactory: () => ({
            getComponentByIdentifier: () => {
              return {};
            },
          }),
        },
        {
          provide: SystemComponentWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: SystemFuelFlowWorkspaceService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UsedIdentifierRepository,
          useFactory: mockUsedIdRepo,
        },
        {
          provide: MonitorSystemMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorSystemWorkspaceService);
    repository = module.get(MonitorSystemWorkspaceRepository);
    componentService = module.get(ComponentWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runMonitorSystemImportCheck', () => {
    it('Should pass with component and system found in database and systemTypeCode is valid', async () => {
      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemComponent = new SystemComponentBaseDTO();
      const systemFuelFlow = new SystemFuelFlowBaseDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.componentId = 'AA0';

      systemComponent.componentId = 'AA0';

      system.monitoringSystemComponentData = [systemComponent];
      system.monitoringSystemFuelFlowData = [systemFuelFlow];
      system.systemTypeCode = 'GAS';

      location.componentData = [component];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      monSys.systemTypeCode = 'GAS';
      repository.findOneBy = jest.fn().mockResolvedValue(monSys);

      jest
        .spyOn(componentService, 'getComponentByIdentifier')
        .mockResolvedValue(compRecord);

      const checkResults = await service.runMonitorSystemImportCheck(
        testData,
        location,
        [system],
        'id',
      );

      expect(checkResults).toEqual([]);
    });

    it('Should fail with component and system found in database and systemTypeCode is valid', async () => {
      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemComponent = new SystemComponentBaseDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'PLC';
      component.componentId = 'AFY';

      systemComponent.componentId = 'AA0';

      system.monitoringSystemComponentData = [systemComponent];
      system.monitoringSystemFuelFlowData = [];
      system.systemTypeCode = 'OIL';

      location.componentData = [component];
      location.monitoringSystemData = [system];
      location.unitId = '1';
      location.stackPipeId = 'CS0AAN';

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      monSys.systemTypeCode = 'GAS';
      repository.findOneBy = jest.fn().mockResolvedValue(monSys);

      jest
        .spyOn(componentService, 'getComponentByIdentifier')
        .mockResolvedValue(null);

      const checkResults = await service.runMonitorSystemImportCheck(
        testData,
        location,
        [system],
        'id',
      );

      const errorList = [
        '[IMPORT5-CRIT1-A] The system type OIL for UnitStackPipeID 1/CS0AAN and MonitoringSystemID undefined does not match the system type in the Workspace database.',
        '[IMPORT7-CRIT1-A] The workspace database and Monitor Plan Import JSON File does not contain a Component record for AA0',
      ];
      expect(checkResults).toEqual(errorList);
    });

    it('Should fail when systemTypeCode in production data is invalid', async () => {
      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemFuelFlow = new SystemFuelFlowBaseDTO();
      const component = new UpdateComponentBaseDTO();

      system.monitoringSystemComponentData = [];
      system.monitoringSystemFuelFlowData = [systemFuelFlow];
      system.systemTypeCode = 'AIR';

      location.componentData = [component];
      location.monitoringSystemData = [system];
      location.unitId = '1';
      location.stackPipeId = 'CS0AAN';

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      monSys.systemTypeCode = 'AIR';
      repository.findOneBy = jest.fn().mockResolvedValue(monSys);

      const checkResults = await service.runMonitorSystemImportCheck(
        testData,
        location,
        [system],
        'id',
      );

      const errorList = [
        '[IMPORT31-CRIT1-A] You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
      ];
      expect(checkResults).toEqual(errorList);
    });

    it('Should fail when systemTypeCode in workspace data is invalid', async () => {
      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemFuelFlow = new SystemFuelFlowBaseDTO();
      const component = new UpdateComponentBaseDTO();

      system.monitoringSystemComponentData = [];
      system.monitoringSystemFuelFlowData = [systemFuelFlow];
      system.systemTypeCode = 'AIR';

      location.componentData = [component];
      location.monitoringSystemData = [system];
      location.unitId = '1';
      location.stackPipeId = 'CS0AAN';

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      repository.findOneBy = jest.fn().mockResolvedValue(null);

      const checkResults = await service.runMonitorSystemImportCheck(
        testData,
        location,
        [system],
        'id',
      );

      const errorList = [
        '[IMPORT31-CRIT1-A] You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
      ];
      expect(checkResults).toEqual(errorList);
    });
  });

  describe('getSystems', () => {
    it('should return array of monitor systems', async () => {
      const result = await service.getSystems(null);
      expect(result).toEqual('');
    });
  });
});
