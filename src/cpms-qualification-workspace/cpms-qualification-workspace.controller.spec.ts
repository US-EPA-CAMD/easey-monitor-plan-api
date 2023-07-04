import { Test, TestingModule } from '@nestjs/testing';
import { CPMSQualificationWorkspaceController } from './cpms-qualification-workspace.controller';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';

describe('CPMSQualificationWorkspaceController', () => {
  let controller: CPMSQualificationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CPMSQualificationWorkspaceController],
      providers: [
        CPMSQualificationWorkspaceService,
        CPMSQualificationWorkspaceRepository,
      ],
    }).compile();

    controller = module.get<CPMSQualificationWorkspaceController>(
      CPMSQualificationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
