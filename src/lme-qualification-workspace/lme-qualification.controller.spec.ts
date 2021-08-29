import { Test, TestingModule } from '@nestjs/testing';

import { LMEQualificationWorkspaceController } from './lme-qualification.controller';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';

jest.mock('./lme-qualification.service');

describe('LMEQualificationWorkspaceController', () => {
  let controller: LMEQualificationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LMEQualificationWorkspaceController],
      providers: [LMEQualificationWorkspaceService],
    }).compile();

    controller = module.get<LMEQualificationWorkspaceController>(
      LMEQualificationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
