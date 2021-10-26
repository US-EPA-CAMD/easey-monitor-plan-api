import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitCapacityWorkspaceController } from './unit-capacity.controller';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';

jest.mock('./unit-capacity.service');

describe('UnitCapacityWorkspaceController', () => {
  let controller: UnitCapacityWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [UnitCapacityWorkspaceController],
      providers: [UnitCapacityWorkspaceService],
    }).compile();

    controller = module.get<UnitCapacityWorkspaceController>(
      UnitCapacityWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
