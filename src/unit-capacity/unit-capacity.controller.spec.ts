import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitCapacityController } from './unit-capacity.controller';
import { UnitCapacityService } from './unit-capacity.service';

jest.mock('./unit-capacity.service');

describe('UnitCapacityController', () => {
  let controller: UnitCapacityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [UnitCapacityController],
      providers: [UnitCapacityService],
    }).compile();

    controller = module.get<UnitCapacityController>(UnitCapacityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
