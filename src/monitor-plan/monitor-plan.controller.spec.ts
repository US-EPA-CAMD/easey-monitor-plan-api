import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanController } from './monitor-plan.controller';

jest.mock('./monitor-plan.service');

const data: MonitorPlanDTO[] = [];
data.push(new MonitorPlanDTO());
data.push(new MonitorPlanDTO());

describe('MonitorPlanController', () => {
  let controller: MonitorPlanController;
  let service: MonitorPlanService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorPlanController],
      providers: [MonitorPlanService],
    }).compile();

    controller = module.get(MonitorPlanController);
    service = module.get(MonitorPlanService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMonitorPlan', () => {
    it('should return a monitor plan given a planId', async () => {
      jest.spyOn(service, 'getTopLevelMonitorPlan').mockResolvedValue(data[0]);
      expect(await controller.getMonitorPlan('')).toBe(data[0]);
    });
  });
});
