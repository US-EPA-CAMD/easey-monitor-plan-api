import { Test, TestingModule } from '@nestjs/testing';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('UnitStackConfigurationWorkspaceService', () => {
  let service: UnitStackConfigurationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitStackConfigurationWorkspaceService,
        {
          provide: UnitStackConfigurationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitStackConfigurationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitStackConfigurationWorkspaceService>(
      UnitStackConfigurationWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
