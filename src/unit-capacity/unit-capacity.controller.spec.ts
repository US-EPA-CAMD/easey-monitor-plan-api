import { Test, TestingModule } from '@nestjs/testing';
import { UnitCapacityController } from './unit-capacity.controller';
import { UnitCapacityService } from './unit-capacity.service';

describe('UnitCapacityController', () => {
  let controller: UnitCapacityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitCapacityController],
      providers: [UnitCapacityService],
    }).compile();

    controller = module.get<UnitCapacityController>(UnitCapacityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
