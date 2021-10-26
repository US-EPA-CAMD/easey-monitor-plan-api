import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanController } from './monitor-plan.controller';

jest.mock('./monitor-plan.service');

const orisCode = null;

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

  describe('getConfigurations', () => {
    it('should return array of monitor plan configurations', async () => {
      jest.spyOn(service, 'getConfigurations').mockResolvedValue(data);
      expect(await controller.getConfigurations(orisCode)).toBe(data);
    });
  });
});
