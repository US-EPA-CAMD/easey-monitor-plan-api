import { Test, TestingModule } from '@nestjs/testing';

import { PCTQualificationWorkspaceController } from './pct-qualification.controller';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';

jest.mock('./pct-qualification.service');

describe('PCTQualificationWorkspaceController', () => {
  let controller: PCTQualificationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PCTQualificationWorkspaceController],
      providers: [PCTQualificationWorkspaceService],
    }).compile();

    controller = module.get<PCTQualificationWorkspaceController>(
      PCTQualificationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
