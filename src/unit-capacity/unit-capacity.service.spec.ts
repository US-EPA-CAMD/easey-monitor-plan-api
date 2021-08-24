import { Test, TestingModule } from '@nestjs/testing';
import { UnitCapacityService } from './unit-capacity.service';

describe('UnitCapacityService', () => {
  let service: UnitCapacityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitCapacityService],
    }).compile();

    service = module.get<UnitCapacityService>(UnitCapacityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
