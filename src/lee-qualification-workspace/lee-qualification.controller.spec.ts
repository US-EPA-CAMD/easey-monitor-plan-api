import { Test, TestingModule } from '@nestjs/testing';

import { LEEQualificationWorkspaceController } from './lee-qualification.controller';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';

jest.mock('./lee-qualification.service');

describe('LEEQualificationWorkspaceController', () => {
  let controller: LEEQualificationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LEEQualificationWorkspaceController],
      providers: [LEEQualificationWorkspaceService],
    }).compile();

    controller = module.get<LEEQualificationWorkspaceController>(
      LEEQualificationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
