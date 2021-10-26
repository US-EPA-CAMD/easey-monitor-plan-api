import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitStackConfigurationController } from './unit-stack-configuration.controller';
import { UnitStackConfigurationService } from './unit-stack-configuration.service';

jest.mock('./unit-stack-configuration.service');

describe('UnitStackConfigurationController', () => {
  let controller: UnitStackConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [UnitStackConfigurationController],
      providers: [UnitStackConfigurationService],
    }).compile();

    controller = module.get<UnitStackConfigurationController>(
      UnitStackConfigurationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
