import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { PCTQualificationService } from './pct-qualification.service';
import { PCTQualificationRepository } from './pct-qualification.repository';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('PCTQualificationService', () => {
  let service: PCTQualificationService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        PCTQualificationService,
        {
          provide: PCTQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: PCTQualificationMap,
          useFactory: mockMap,
        },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<PCTQualificationService>(PCTQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPCTQualifications', () => {
    it('should return array of pct qualifications', async () => {
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
       );
      const result = await service.getPCTQualifications(null);
      expect(result).toEqual('');
    });
  });
});
