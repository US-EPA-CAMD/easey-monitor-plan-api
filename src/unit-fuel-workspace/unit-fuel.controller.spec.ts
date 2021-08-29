import { Test, TestingModule } from '@nestjs/testing';

import { UnitFuelWorkspaceController } from './unit-fuel.controller';
import { UnitFuelWorkspaceService } from './unit-fuel.service';

jest.mock('./unit-fuel.service');

describe('UnitFuelWorkspaceController', () => {
  let controller: UnitFuelWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitFuelWorkspaceController],
      providers: [UnitFuelWorkspaceService],
    }).compile();

    controller = module.get<UnitFuelWorkspaceController>(
      UnitFuelWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
