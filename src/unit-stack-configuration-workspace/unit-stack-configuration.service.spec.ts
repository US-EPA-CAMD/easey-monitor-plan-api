import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { StackPipeService } from '../stack-pipe/stack-pipe.service';
import { UnitService } from '../unit/unit.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UnitStackConfigurationBaseDTO } from '../dtos/unit-stack-configuration.dto';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
  findOne: jest.fn().mockResolvedValue(undefined),
  update: jest.fn(),
  create: jest.fn().mockResolvedValue('Why'),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

const mockStackPipe = () => ({
  getStackByNameAndFacId: jest.fn().mockResolvedValue(''),
});

const mockUnit = () => ({
  getUnitByNameAndFacId: jest.fn().mockResolvedValue(''),
});

describe('UnitStackConfigurationWorkspaceService', () => {
  let service: UnitStackConfigurationWorkspaceService;
  let repo: UnitStackConfigurationWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitStackConfigurationWorkspaceService,
        {
          provide: StackPipeService,
          useFactory: mockStackPipe,
        },
        {
          provide: UnitService,
          useFactory: mockUnit,
        },
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

    repo = module.get<UnitStackConfigurationWorkspaceRepository>(
      UnitStackConfigurationWorkspaceRepository,
    );
    service = module.get<UnitStackConfigurationWorkspaceService>(
      UnitStackConfigurationWorkspaceService,
    );
  });

  describe('importUnitStack', () => {
    it('Should create new record given an undefined one', async () => {
      const plan = new UpdateMonitorPlanDTO();
      plan.unitStackConfiguration = [new UnitStackConfigurationBaseDTO()];
      await service.importUnitStack(plan, 1, '');
      expect(repo.create).toHaveBeenCalled();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
