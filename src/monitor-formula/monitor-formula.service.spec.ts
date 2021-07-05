import { Test } from '@nestjs/testing';

import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaRepository } from './monitor-formula.repository';
import { MonitorFormulaService } from './monitor-formula.service';

const mockMonitorFormulaRepository = () => ({
  find: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('-- Monitor Formula Service --', () => {
  let monitorFormulaService;
  let monitorFormulaRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorFormulaService,
        {
          provide: MonitorFormulaRepository,
          useFactory: mockMonitorFormulaRepository,
        },
        { provide: MonitorFormulaMap, useFactory: mockMap },
      ],
    }).compile();

    monitorFormulaService = module.get(MonitorFormulaService);
    monitorFormulaRepository = module.get(MonitorFormulaRepository);
    map = module.get(MonitorFormulaMap);
  });

  describe('* getMonitorFormulas', () => {
    it('should return all monitor formulas with the specified monLocId', async () => {
      map.many.mockReturnValue('mockMonitorFormulas');

      const monLocId = '123';

      const result = await monitorFormulaService.getFormulas(monLocId);

      expect(monitorFormulaRepository.find).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorFormulas');
    });
  });

  describe('* getMonitorFormulas', () => {
    it('should return all monitor spans with the specified monLocId', async () => {
      map.many.mockReturnValue('mockMonitorFormulas');

      const monLocId = '123';

      const result = await monitorFormulaService.getFormulas(monLocId);

      expect(monitorFormulaRepository.find).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorFormulas');
    });
  });
});
