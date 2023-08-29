import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemCheckService } from './monitor-system-checks.service';
import { UpdateMonitorSystemDTO } from '../dtos/monitor-system.dto';
import { SystemComponentBaseDTO } from '../dtos/system-component.dto';
import { ComponentCheckService } from '../component-workspace/component-checks.service';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const locationId = '1';
const payload = new UpdateMonitorSystemDTO();
const systemComponent = new SystemComponentBaseDTO();

payload.components = [systemComponent];

describe('Monitor System Check Service Tests', () => {
  let service: MonitorSystemCheckService;
  let componentCheckService: ComponentCheckService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorSystemCheckService,
        {
          provide: ComponentCheckService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    service = module.get(MonitorSystemCheckService);
    componentCheckService = module.get(ComponentCheckService);
  });

  describe('RunChecks', () => {
    it('Should Call Children.runChecks functions', async () => {
      await service.runChecks(locationId, payload);
      expect(componentCheckService.runChecks).toHaveBeenCalled();
    });
  });
});
