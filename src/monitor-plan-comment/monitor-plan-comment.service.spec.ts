import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentService } from './monitor-plan-comment.service';
import { MonitorPlanCommentRepository } from './monitor-plan-comment.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorPlanCommentService', () => {
  let service: MonitorPlanCommentService;

  beforeAll(async () => {
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
      ],
    }).compile();

    service = module.get(MonitorPlanCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComments', () => {
    it('should return array of monitor plan comments', async () => {
      const result = await service.getComments(null);
      expect(result).toEqual('');
    });
  });
});
