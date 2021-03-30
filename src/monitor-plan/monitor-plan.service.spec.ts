import { Test } from '@nestjs/testing';

import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';

const mockMonitorPlanRepository = () => ({
  getMonitorPlansByOrisCode: jest.fn(),
});

const mockMonitorLocationRepository = () => ({
  getMonitorLocationsByFacId: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

let monitorPlanEntity: MonitorPlan = new MonitorPlan();
monitorPlanEntity.id = '123';
monitorPlanEntity.facId = 3;
monitorPlanEntity.locations = [];

let monitorLocationEntity1: MonitorLocation = new MonitorLocation();
monitorLocationEntity1.id = '5';
monitorLocationEntity1.plans = [monitorPlanEntity];
monitorLocationEntity1.plans[0].id = '123';

let monitorLocationEntity2: MonitorLocation = new MonitorLocation();
monitorLocationEntity2.id = '10';
monitorLocationEntity2.plans = [];

describe('-- Monitor Plan Service --', () => {
  let monitorPlanService;
  let monitorPlanRepository;
  let monitorLocationRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorPlanService,
        {
          provide: MonitorPlanRepository,
          useFactory: mockMonitorPlanRepository,
        },
        {
          provide: MonitorLocationRepository,
          useFactory: mockMonitorLocationRepository,
        },
        { provide: MonitorPlanMap, useFactory: mockMap },
      ],
    }).compile();

    monitorPlanService = module.get(MonitorPlanService);
    monitorPlanRepository = module.get(MonitorPlanRepository);

    monitorLocationRepository = module.get(MonitorLocationRepository);

    map = module.get(MonitorPlanMap);
  });

  describe('* getConfigurations', () => {
   
  });

  describe('* setMonitoringPlanStatus', () => {
    
  });

  describe('* setUnitAndStackStatus', () => {
   
  });
  describe('* setUnitAndStackStatus', () => {
   
  });


});