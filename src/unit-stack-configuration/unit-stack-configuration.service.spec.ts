import { Test, TestingModule } from '@nestjs/testing';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationService } from './unit-stack-configuration.service';
import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('UnitStackConfigurationService', () => {
  let service: UnitStackConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitStackConfigurationService,
        {
          provide: UnitStackConfigurationRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitStackConfigurationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitStackConfigurationService>(
      UnitStackConfigurationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
