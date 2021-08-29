import { Test, TestingModule } from '@nestjs/testing';

import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelService } from './unit-fuel.service';
import { UnitFuelRepository } from './unit-fuel.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('UnitFuelService', () => {
  let service: UnitFuelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitFuelService,
        {
          provide: UnitFuelRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitFuelMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitFuelService>(UnitFuelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
