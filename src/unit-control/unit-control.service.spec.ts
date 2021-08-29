import { Test, TestingModule } from '@nestjs/testing';

import { UnitControlMap } from '../maps/unit-control.map';
import { UnitControlService } from './unit-control.service';
import { UnitControlRepository } from './unit-control.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('UnitControlService', () => {
  let service: UnitControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitControlService,
        {
          provide: UnitControlRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitControlMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitControlService>(UnitControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
