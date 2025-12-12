import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';

const mockMonitorPlan = {
  id: 'test-plan-id',
  submissionAvailabilityCode: 'UPDATED'
};

const mockMonitorPlanComment = {
  monitoringPlanComment: 'Test comment',
  beginDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31')
};

const mockCommentEntity = {
  id: 'comment-id-1',
  monitorPlanId: 'test-plan-id',
  monitorPlanComment: 'Test comment',
  beginDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
  userId: 'test-user',
  addDate: new Date(),
  updateDate: new Date()
};

const entityManagerMock = {
  findOne: jest.fn().mockResolvedValue(mockMonitorPlan),
  query: jest.fn().mockResolvedValue([]),
};

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue([mockCommentEntity]),
  findOneBy: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue(mockCommentEntity),
  create: jest.fn().mockReturnValue(mockCommentEntity),
  save: jest.fn().mockResolvedValue(mockCommentEntity),
});

const mockMonitorPlanWorkspaceRepository = () => ({
  resetToNeedsEvaluation: jest.fn().mockResolvedValue(true),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([mockCommentEntity]),
  one: jest.fn().mockResolvedValue(mockCommentEntity),
});

describe('MonitorPlanCommentWorkspaceService', () => {
  let service: MonitorPlanCommentWorkspaceService;
  let repository: MonitorPlanCommentWorkspaceRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorPlanCommentWorkspaceService,
        {
          provide: MonitorPlanCommentWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorPlanWorkspaceRepository,
          useFactory: mockMonitorPlanWorkspaceRepository,
        },
        {
          provide: MonitorPlanCommentMap,
          useFactory: mockMap,
        },
        {
          provide: EntityManager,
          useValue: entityManagerMock,
        },
      ],
    }).compile();

    service = module.get(MonitorPlanCommentWorkspaceService);
    repository = module.get(MonitorPlanCommentWorkspaceRepository);
    entityManager = module.get(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runChecks', () => {
    it('should throw MONPLAN-3-A', async () => {
      entityManagerMock.findOne.mockResolvedValueOnce({
        ...mockMonitorPlan,
      });

      // Mock duplicate found
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(mockCommentEntity as any);

      await expect(
        service.runChecks(mockMonitorPlanComment, 'test-plan-id')
      ).rejects.toThrow('MONPLAN-3-A');
    });

    it('should not throw error when no duplicates found', async () => {
      entityManagerMock.findOne.mockResolvedValueOnce({
        ...mockMonitorPlan,
      });

      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(
        service.runChecks(mockMonitorPlanComment, 'test-plan-id')
      ).resolves.not.toThrow();
    });
  });

  describe('getComments', () => {
    it('should return array of monitor plan comments', async () => {
      const result = await service.getComments('test-plan-id');
      expect(result).toEqual([mockCommentEntity]);
    });
  });

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      entityManagerMock.findOne.mockResolvedValueOnce({
        ...mockMonitorPlan,
        submissionAvailabilityCode: 'OTHER'
      });
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

      const result = await service.createComment(
        'test-plan-id',
        mockMonitorPlanComment,
        'test-user'
      );

      expect(result).toEqual(mockCommentEntity);
    });
  });

  describe('updateComment', () => {
    it('should update a comment successfully', async () => {
      entityManagerMock.findOne.mockResolvedValueOnce({
        ...mockMonitorPlan,
        submissionAvailabilityCode: 'OTHER'
      });
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

      const result = await service.updateComment(
        'test-plan-id',
        mockMonitorPlanComment,
        'test-user',
        'comment-id-1'
      );

      expect(result).toEqual(mockCommentEntity);
    });
  });
});