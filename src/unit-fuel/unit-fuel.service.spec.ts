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

  beforeAll(async () => {
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

    service = module.get(UnitFuelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnitFuels', () => {
    it('should return array of unit fuels', async () => {
      const result = await service.getUnitFuels(null);
      expect(result).toEqual('');
    });
  });
});
