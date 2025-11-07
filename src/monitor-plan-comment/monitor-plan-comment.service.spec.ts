import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentService } from './monitor-plan-comment.service';
import { MonitorPlanCommentRepository } from './monitor-plan-comment.repository';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');
const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorPlanCommentService', () => {
  let service: MonitorPlanCommentService;
  let dataSource: DataSource;

  beforeAll(async () => {
     dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorPlanCommentService,
        {
          provide: MonitorPlanCommentRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorPlanCommentMap,
          useFactory: mockMap,
        },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(MonitorPlanCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComments', () => {
    it('should return array of monitor plan comments', async () => {

      (useSlaveRepository as jest.Mock).mockImplementation(
        async (_dataSource, _repo, callback) =>
          callback(mockRepository()) 
      );
      const result = await service.getComments(null);
      expect(result).toEqual('');
    });
  });
});

