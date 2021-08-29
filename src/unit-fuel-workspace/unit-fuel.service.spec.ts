import { Test, TestingModule } from '@nestjs/testing';

import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('UnitFuelWorkspaceService', () => {
  let service: UnitFuelWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitFuelWorkspaceService,
        {
          provide: UnitFuelWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitFuelMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitFuelWorkspaceService>(UnitFuelWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
