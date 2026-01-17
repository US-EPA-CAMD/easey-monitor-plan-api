import { Test, TestingModule } from '@nestjs/testing';

import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { LEEQualificationService } from './lee-qualification.service';
import { LEEQualificationRepository } from './lee-qualification.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('LEEQualificationService', () => {
  let service: LEEQualificationService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LEEQualificationService,
        {
          provide: LEEQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: LEEQualificationMap,
          useFactory: mockMap,
        },
       {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<LEEQualificationService>(LEEQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLEEQualifications', () => {
    it('should return array of lee qualifications', async () => {
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
       );
      const result = await service.getLEEQualifications(null);
      expect(result).toEqual('');
    });
  });
});
