import { Test } from '@nestjs/testing';

import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodRepository } from './monitor-method.repository';
import { MonitorMethodService } from './monitor-method.service';

const mockMonitorMethodRepository = () => ({
  find: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('-- Monitor Method Service --', () => {
  let monitorMethodService;
  let monitorMethodRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorMethodService,
        {
          provide: MonitorMethodRepository,
          useFactory: mockMonitorMethodRepository,
        },
        { provide: MonitorMethodMap, useFactory: mockMap },
      ],
    }).compile();

    monitorMethodService = module.get(MonitorMethodService);
    monitorMethodRepository = module.get(MonitorMethodRepository);
    map = module.get(MonitorMethodMap);
  });

  describe('* getMonitorMethods', () => {
    it('should return all monitor methods with the specified monLocId', async () => {
      map.many.mockReturnValue('mockMonitorMethods');

      const monLocId = '123';

      let result = await monitorMethodService.getMonitorMethods(monLocId);

      expect(monitorMethodRepository.find).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorMethods');
    });
  });
});
