import { Test } from "@nestjs/testing";
import { ConfigService } from '@nestjs/config';

import { MonitorLocationRepository } from "../monitor-location/monitor-location.repository";
import { MonitorPlanRepository } from "./monitor-plan.repository";
import { MonitorPlanController } from './monitor-plan.controller';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import{ComponentMap} from '../maps/component.map';
import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
import{systemComponentMap} from '../maps/monitor-system-component.map';
import { ComponentRepository } from '../component/component.repository';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { UnitOpStatusMap } from '../maps/unit-op-status.map';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UnitOpStatusDTO } from '../dtos/unit-op-status.dto';


const mockConfigService = () => ({
  get: jest.fn(),
});

describe('-- Monitor Plan Controller --', () => {
  let monitorPlanController: MonitorPlanController;
  let monitorPlanService: MonitorPlanService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
        controllers: [MonitorPlanController],
        providers: [
          MonitorPlanMap,
          MonitorLocationMap,
          MonitorPlanService,
          MonitorPlanRepository,
          MonitorLocationRepository,
          SystemFuelFlow,
          MonitorSystemComponent,
          systemComponentMap,
          ComponentMap,
          SystemFuelFlowMap,
          ComponentRepository,
          UnitOpStatusMap,
          UnitOpStatusDTO,
          UnitOpStatusRepository,
          
          {
            provide: ConfigService,
            useFactory: mockConfigService,
          },          
        ],
      }).compile();

      monitorPlanController = module.get(MonitorPlanController);
      monitorPlanService = module.get(MonitorPlanService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getMonitorPlans', () => {
    it('should return a list of Monitor Plans', async () => {
      const orisCode = 123;
      const expectedResult: MonitorPlanDTO[] = [];

      const serviceSpy = jest
        .spyOn(monitorPlanService, 'getConfigurations')
        .mockResolvedValue(expectedResult);

      const result = await monitorPlanController.getConfigurations(orisCode);

      expect(serviceSpy).toHaveBeenCalledWith(orisCode);
      expect(result).toBe(expectedResult);
    });
  });
 });