import { Test, TestingModule } from '@nestjs/testing';

import { UnitControlController } from './unit-control.controller';
import { UnitControlService } from './unit-control.service';

jest.mock('./unit-control.service');

describe('UnitControlController', () => {
  let controller: UnitControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitControlController],
      providers: [UnitControlService],
    }).compile();

    controller = module.get<UnitControlController>(UnitControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
