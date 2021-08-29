import { Test, TestingModule } from '@nestjs/testing';

import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorFormulaWorkspaceService', () => {
  let service: MonitorFormulaWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorFormulaWorkspaceService,
        {
          provide: MonitorFormulaWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorFormulaMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorFormulaWorkspaceService);
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
