import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorQualificationWorkspaceController } from './monitor-qualification.controller';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';

jest.mock('./monitor-qualification.service');

describe('MonitorQualificationWorkspaceController', () => {
  let controller: MonitorQualificationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorQualificationWorkspaceController],
      providers: [MonitorQualificationWorkspaceService],
    }).compile();

    controller = module.get<MonitorQualificationWorkspaceController>(
      MonitorQualificationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
