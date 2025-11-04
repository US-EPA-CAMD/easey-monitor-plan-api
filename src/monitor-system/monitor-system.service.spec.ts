import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '../utilities/use-slave-repository';

jest.mock('../utilities/use-slave-repository');

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorSystemService', () => {
  let service: MonitorSystemService;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorSystemService,
        {
          provide: MonitorSystemRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSystemMap,
          useFactory: mockMap,
        },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(MonitorSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSystems', () => {
    it('should return array of monitor systems', async () => {
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
       );
      const result = await service.getSystems(null);
      expect(result).toEqual('');
    });
  });
});
