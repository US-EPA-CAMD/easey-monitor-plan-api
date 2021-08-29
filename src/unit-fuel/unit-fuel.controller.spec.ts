import { Test, TestingModule } from '@nestjs/testing';

import { UnitFuelController } from './unit-fuel.controller';
import { UnitFuelService } from './unit-fuel.service';

jest.mock('./unit-fuel.service');

describe('UnitFuelController', () => {
  let controller: UnitFuelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitFuelController],
      providers: [UnitFuelService],
    }).compile();

    controller = module.get<UnitFuelController>(UnitFuelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
