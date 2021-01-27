import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { MonitorLocationService } from './monitor-location.service';

describe('-- Monitor Locations Service --', () => {
  let monitorLocationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MonitorLocationService, ConfigService],
    }).compile();

    monitorLocationService = module.get(MonitorLocationService);
  });

  describe('getMonitorLocations', () => {
    it('returns static data', async () => {
      let result = await monitorLocationService.getMonitorLocations();

      expect(result).toEqual('Hello getMonitorLocations!');
    });
  });
});
