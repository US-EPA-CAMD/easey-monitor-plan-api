import { Test } from '@nestjs/testing';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanParamsDTO } from './dto/monitor-plan-params.dto';

const mockMonitorPlanRepository = () => ({
  getMonitorPlan: jest.fn(),
});

describe('MonitorPlanService', () => {
  let monitorPlanService;
  let monitorPlanRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorPlanService,
        {
          provide: MonitorPlanRepository,
          useFactory: mockMonitorPlanRepository,
        },
      ],
    }).compile();

    monitorPlanService = module.get<MonitorPlanService>(MonitorPlanService);
    monitorPlanRepository = module.get<MonitorPlanRepository>(
      MonitorPlanRepository,
    );
  });

  describe('getMonitorPlan', () => {
    it('calls MonitorPlanRepository.getMonitorPlan() and gets all the monitor plans for a particular facility', async () => {
      monitorPlanRepository.getMonitorPlan.mockReturnValue(
        'list of monitor plans',
      );

      const params: MonitorPlanParamsDTO = {
        facId: 1,
        orisCode: 1,
        active: true,
        page: 1,
        perPage: 1,
        orderBy: 'some string',
      };

      expect(monitorPlanRepository.getMonitorPlan).not.toHaveBeenCalled();
      const result = monitorPlanService.getMonitorPlan(params);

      expect(monitorPlanRepository.getMonitorPlan).toHaveBeenCalled();
      expect(result).toEqual('list of monitor plans');
    });
  });
});
