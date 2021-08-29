import { Test, TestingModule } from '@nestjs/testing';

import { UnitControlWorkspaceController } from './unit-control.controller';
import { UnitControlWorkspaceService } from './unit-control.service';

jest.mock('./unit-control.service');

describe('UnitControlWorkspaceController', () => {
  let controller: UnitControlWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitControlWorkspaceController],
      providers: [UnitControlWorkspaceService],
    }).compile();

    controller = module.get<UnitControlWorkspaceController>(
      UnitControlWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
