import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorQualificationService } from './monitor-qualification.service';
import { MonitorQualificationRepository } from './monitor-qualification.repository';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '../utilities/use-slave-repository';

jest.mock('../utilities/use-slave-repository');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorQualificationService', () => {
  let service: MonitorQualificationService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorQualificationService,
        {
          provide: MonitorQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorQualificationMap,
          useFactory: mockMap,
        },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<MonitorQualificationService>(
      MonitorQualificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQualifications', () => {
    it('should return array of location qualifications', async () => {
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
       );
      const result = await service.getQualifications(null);
      expect(result).toEqual('');
    });
  });
});
