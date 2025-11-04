import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefaultService } from './monitor-default.service';
import { MonitorDefaultRepository } from './monitor-default.repository';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '../utilities/use-slave-repository';

jest.mock('../utilities/use-slave-repository');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorDefaultService', () => {
  let service: MonitorDefaultService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorDefaultService,
        {
          provide: MonitorDefaultRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorDefaultMap,
          useFactory: mockMap,
        },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<MonitorDefaultService>(MonitorDefaultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDefaults', () => {
    it('should return array of location defaults', async () => {
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
       );
      const result = await service.getDefaults(null);
      expect(result).toEqual('');
    });
  });
});
