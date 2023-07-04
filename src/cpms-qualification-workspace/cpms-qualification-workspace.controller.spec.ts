import { Test, TestingModule } from '@nestjs/testing';
import { CpmsQualificationWorkspaceController } from './cpms-qualification-workspace.controller';
import { CpmsQualificationWorkspaceService } from './cpms-qualification-workspace.service';

describe('CpmsQualificationWorkspaceController', () => {
  let controller: CpmsQualificationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CpmsQualificationWorkspaceController],
      providers: [CpmsQualificationWorkspaceService],
    }).compile();

    controller = module.get<CpmsQualificationWorkspaceController>(
      CpmsQualificationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
