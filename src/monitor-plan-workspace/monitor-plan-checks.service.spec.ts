import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

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

monitorSystem.monitoringSystemComponentData = [systemComponent];
location.monitoringSystemData = [monitorSystem];
location.unitControlData = [unitControl];
location.componentData = [component];
location.supplementalMATSMonitoringMethodData = [matsMethod];
payload.locations = [location];
location.monitoringSpanData = [monitorSpan];

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
      ],
    }).compile();

    service = module.get(MonitorPlanChecksService);
    matsMethodChecksService = module.get(MatsMethodChecksService);
    unitControlChecksService = module.get(UnitControlChecksService);
    componentCheckService = module.get(ComponentCheckService);
    monitorSystemCheckService = module.get(MonitorSystemCheckService);
    monitorSpanCheckService = module.get(MonitorSpanChecksService);
  });

  describe('RunChecks', () => {
    it('Should Call Children.runChecks functions', async () => {
      await service.runChecks(payload);
      expect(matsMethodChecksService.runChecks).toHaveBeenCalled();
      expect(unitControlChecksService.runChecks).toHaveBeenCalled();
      expect(componentCheckService.runChecks).toHaveBeenCalled();
      expect(monitorSystemCheckService.runChecks).toHaveBeenCalled();
      expect(monitorSpanCheckService.runChecks).toHaveBeenCalled();
    });
  });
});
