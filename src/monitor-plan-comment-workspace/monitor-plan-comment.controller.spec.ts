import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';
import { MonitorPlanCommentWorkspaceController } from './monitor-plan-comment.controller';

jest.mock('./monitor-plan-comment.service');

const planId = 'some id';

const data: MonitorPlanCommentDTO[] = [];
data.push(new MonitorPlanCommentDTO());
data.push(new MonitorPlanCommentDTO());

describe('MonitorPlanCommentWorkspaceController', () => {
  let controller: MonitorPlanCommentWorkspaceController;
  let service: MonitorPlanCommentWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorPlanCommentWorkspaceController],
      providers: [MonitorPlanCommentWorkspaceService],
    }).compile();

    controller = module.get(MonitorPlanCommentWorkspaceController);
    service = module.get(MonitorPlanCommentWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getComments', () => {
    it('should return array of monitor plan comments', async () => {
      jest.spyOn(service, 'getComments').mockResolvedValue(data);
      expect(await controller.getComments(planId)).toBe(data);
    });
  });
});
