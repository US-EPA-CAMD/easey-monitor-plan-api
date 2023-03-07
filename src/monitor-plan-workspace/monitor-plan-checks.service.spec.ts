import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

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
import { MonitorSystemBaseDTO } from '../dtos/monitor-system.dto';
import { SystemComponentBaseDTO } from '../dtos/system-component.dto';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const payload = new UpdateMonitorPlanDTO();
const location = new UpdateMonitorLocationDTO();
const matsMethod = new MatsMethodBaseDTO();
const unitControl = new UnitControlBaseDTO();
const component = new UpdateComponentBaseDTO();
const monitorSystem = new MonitorSystemBaseDTO();
const systemComponent = new SystemComponentBaseDTO();

monitorSystem.components = [systemComponent];
location.systems = [monitorSystem];
location.unitControls = [unitControl];
location.components = [component];
location.matsMethods = [matsMethod];
payload.locations = [location];

describe('Monitor Plan Checks Service Test', () => {
  let service: MonitorPlanChecksService;
  let matsMethodChecksService: MatsMethodChecksService;
  let unitControlChecksService: UnitControlChecksService;
  let componentCheckService: ComponentCheckService;
  let monitorSystemCheckService: MonitorSystemCheckService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        MonitorPlanChecksService,
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
      ],
    }).compile();

    service = module.get(MonitorPlanChecksService);
    matsMethodChecksService = module.get(MatsMethodChecksService);
    unitControlChecksService = module.get(UnitControlChecksService);
    componentCheckService = module.get(ComponentCheckService);
    monitorSystemCheckService = module.get(MonitorSystemCheckService);
  });

  describe('RunChecks', () => {
    it('Should Call Children.runChecks functions', async () => {
      await service.runChecks(payload);
      expect(matsMethodChecksService.runChecks).toHaveBeenCalled();
      expect(unitControlChecksService.runChecks).toHaveBeenCalled();
      expect(componentCheckService.runChecks).toHaveBeenCalled();
      expect(monitorSystemCheckService.runChecks).toHaveBeenCalled();
    });
  });
});
