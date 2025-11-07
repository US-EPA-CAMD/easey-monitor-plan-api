import { Test, TestingModule } from '@nestjs/testing';

import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { LMEQualificationService } from './lme-qualification.service';
import { LMEQualificationRepository } from './lme-qualification.repository';
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

describe('LMEQualificationService', () => {
  let service: LMEQualificationService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LMEQualificationService,
        {
          provide: LMEQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: LMEQualificationMap,
          useFactory: mockMap,
        },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<LMEQualificationService>(LMEQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLMEQualifications', () => {
    it('should return array of lme qualifications', async () => {
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
       );
      const result = await service.getLMEQualifications(null);
      expect(result).toEqual('');
    });
  });
});
