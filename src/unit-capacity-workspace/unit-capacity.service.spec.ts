import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('UnitCapacityWorkspaceService', () => {
  let service: UnitCapacityWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitCapacityWorkspaceService,
        {
          provide: UnitCapacityWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitCapacityMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitCapacityWorkspaceService>(
      UnitCapacityWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
