import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaService } from './monitor-formula.service';
import { MonitorFormulaRepository } from './monitor-formula.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorFormulaService', () => {
  let service: MonitorFormulaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorFormulaService,
        {
          provide: MonitorFormulaRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorFormulaMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorFormulaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFormulas', () => {
    it('should return array of monitor formulas', async () => {
      const result = await service.getFormulas(null);
      expect(result).toEqual('');
    });
  });
});
