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
    it('should return all monitor plan configuration data for the specified oris code', async () => {
      monitorPlanRepository.getMonitorPlansByOrisCode.mockResolvedValue([
        monitorPlanEntity,
      ]);
      monitorLocationRepository.getMonitorLocationsByFacId.mockResolvedValue([
        monitorLocationEntity1,
        monitorLocationEntity2,
      ]);

      map.many.mockReturnValue(['location 1', 'location 2']);

      const orisCode = 7;

      let result = await monitorPlanService.getConfigurations(orisCode);

      expect(
        monitorPlanRepository.getMonitorPlansByOrisCode,
      ).toHaveBeenCalledWith(orisCode);
      expect(
        monitorLocationRepository.getMonitorLocationsByFacId,
      ).toHaveBeenCalledWith(monitorPlanEntity.facId);
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual(['location 1', 'location 2']);
    });

    it('should return all sorted monitor plan configuration data for the specified oris code', async () => {
      let monitorPlanDTO1: MonitorPlanDTO = new MonitorPlanDTO();
      monitorPlanDTO1.id = '1';
      monitorPlanDTO1.name = 'monitorPlan1';
      monitorPlanDTO1.locations = [];
      monitorPlanDTO1.links = [];

      let monitorPlanDTO2: MonitorPlanDTO = new MonitorPlanDTO();
      monitorPlanDTO2.id = '2';
      monitorPlanDTO2.name = 'monitorPlan2';
      monitorPlanDTO2.locations = [];
      monitorPlanDTO2.links = [];

      let monitorPlanDTO3: MonitorPlanDTO = new MonitorPlanDTO();
      monitorPlanDTO3.id = '3';
      monitorPlanDTO3.name = 'monitorPlan3';
      monitorPlanDTO3.locations = [];
      monitorPlanDTO3.links = [];

      monitorPlanRepository.getMonitorPlansByOrisCode.mockResolvedValue([
        monitorPlanEntity,
      ]);
      monitorLocationRepository.getMonitorLocationsByFacId.mockResolvedValue([
        monitorLocationEntity1,
        monitorLocationEntity2,
      ]);

      map.many.mockReturnValue([
        monitorPlanDTO3,
        monitorPlanDTO1,
        monitorPlanDTO2,
      ]);

      const orisCode = 7;

      let result = await monitorPlanService.getConfigurations(orisCode);

      expect(
        monitorPlanRepository.getMonitorPlansByOrisCode,
      ).toHaveBeenCalledWith(orisCode);
      expect(
        monitorLocationRepository.getMonitorLocationsByFacId,
      ).toHaveBeenCalledWith(monitorPlanEntity.facId);
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual([
        monitorPlanDTO1,
        monitorPlanDTO2,
        monitorPlanDTO3,
      ]);
    });
  });
});
