import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeService } from './monitor-attribute.service';
import { MonitorAttributeRepository } from './monitor-attribute.repository';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '../utilities/use-slave-repository';

jest.mock('../utilities/use-slave-repository');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

const locId = 'string';

describe('MonitorAttributeService', () => {
  let service: MonitorAttributeService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        MonitorAttributeService,
        {
          provide: MonitorAttributeRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorAttributeMap,
          useFactory: mockMap,
        },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<MonitorAttributeService>(MonitorAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAttributes', () => {
    it('should return array of location attributes', async () => {
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
       );
      const result = await service.getAttributes(locId);
      expect(result).toEqual('');
    });
  });
});
