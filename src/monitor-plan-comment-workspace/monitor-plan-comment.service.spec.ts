import { Test, TestingModule } from '@nestjs/testing';

import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorPlanCommentWorkspaceService', () => {
  let service: MonitorPlanCommentWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorPlanCommentWorkspaceService,
        {
          provide: MonitorPlanCommentWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorPlanCommentMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorPlanCommentWorkspaceService);
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
