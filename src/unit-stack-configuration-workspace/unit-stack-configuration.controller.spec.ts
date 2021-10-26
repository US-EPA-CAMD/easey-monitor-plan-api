import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitStackConfigurationWorkspaceController } from './unit-stack-configuration.controller';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';

jest.mock('./unit-stack-configuration.service');

describe('UnitStackConfigurationWorkspaceController', () => {
  let controller: UnitStackConfigurationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [UnitStackConfigurationWorkspaceController],
      providers: [UnitStackConfigurationWorkspaceService],
    }).compile();

    controller = module.get<UnitStackConfigurationWorkspaceController>(
      UnitStackConfigurationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
