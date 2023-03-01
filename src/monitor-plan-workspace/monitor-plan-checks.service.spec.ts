import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { MonitorPlanChecksService } from './monitor-plan-checks.service';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodChecksService } from '../mats-method-workspace/mats-method-checks.service';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const payload = new MonitorPlanDTO();
const location = new MonitorLocationDTO();
const matsMethods = new MatsMethodDTO();
location.matsMethods = [matsMethods];
payload.locations = [location];

describe('Monitor Plan Checks Service Test', () => {
  let service: MonitorPlanChecksService;
  let matsMethodChecksService: MatsMethodChecksService;

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
      ],
    }).compile();

    service = module.get(MonitorPlanChecksService);
    matsMethodChecksService = module.get(MatsMethodChecksService);
  });

  describe('RunChecks', () => {
    it('Should Call MatsMethodChecksService.runChecks', async () => {
      await service.runChecks(payload);
      expect(matsMethodChecksService.runChecks).toHaveBeenCalled();
    });
  });
});
