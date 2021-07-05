import { Test } from '@nestjs/testing';

import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadRepository } from './monitor-load.repository';
import { MonitorLoadService } from './monitor-load.service';

const mockMonitorLoadRepository = () => ({
  find: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('-- Monitor Load Service --', () => {
  let monitorLoadService;
  let monitorLoadRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorLoadService,
        {
          provide: MonitorLoadRepository,
          useFactory: mockMonitorLoadRepository,
        },
        { provide: MonitorLoadMap, useFactory: mockMap },
      ],
    }).compile();

    monitorLoadService = module.get(MonitorLoadService);
    monitorLoadRepository = module.get(MonitorLoadRepository);
    map = module.get(MonitorLoadMap);
  });

  describe('* getMonitorLoads', () => {
    it('should return all monitor loads with the specified monLocId', async () => {
      map.many.mockReturnValue('mockMonitorLoads');

      const monLocId = '123';

      const result = await monitorLoadService.getLoads(monLocId);

      expect(monitorLoadRepository.find).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorLoads');
    });
  });

  describe('* getMonitorLoads', () => {
    it('should return all monitor spans with the specified monLocId', async () => {
      map.many.mockReturnValue('mockMonitorLoads');

      const monLocId = '123';

      const result = await monitorLoadService.getLoads(monLocId);

      expect(monitorLoadRepository.find).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorLoads');
    });
  });
});
