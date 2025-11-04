import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaService } from './monitor-formula.service';
import { MonitorFormulaRepository } from './monitor-formula.repository';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '../utilities/use-slave-repository';

jest.mock('../utilities/use-slave-repository');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorFormulaService', () => {
  let service: MonitorFormulaService;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = {} as DataSource;

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
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(MonitorFormulaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFormulas', () => {
    it('should return array of monitor formulas', async () => {
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
       );
      const result = await service.getFormulas(null);
      expect(result).toEqual('');
    });
  });
});
