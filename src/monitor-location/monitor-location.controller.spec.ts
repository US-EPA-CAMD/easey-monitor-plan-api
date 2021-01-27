import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { MonitorLocationController } from './monitor-location.controller';
import { MonitorLocationService } from './monitor-location.service';

describe('-- Monitor Locations Controller --', () => {
  let monitorLocationController: MonitorLocationController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [MonitorLocationController],
      providers: [MonitorLocationService, ConfigService],
    }).compile();

    monitorLocationController = module.get(MonitorLocationController);
  });

  describe('* getMonitorLocations', () => {
    it('should call the service and return static data', async () => {
      const result = monitorLocationController.getMonitorLocations();

      expect(result).toBe('Hello getMonitorLocations!');
    });
  });
});
