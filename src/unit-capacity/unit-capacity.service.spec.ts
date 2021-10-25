import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityService } from './unit-capacity.service';
import { UnitCapacityRepository } from './unit-capacity.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('UnitCapacityService', () => {
  let service: UnitCapacityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitCapacityService,
        {
          provide: UnitCapacityRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitCapacityMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitCapacityService>(UnitCapacityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
