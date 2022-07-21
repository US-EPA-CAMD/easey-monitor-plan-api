import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { StackPipeService } from '../stack-pipe/stack-pipe.service';
import { UnitService } from '../unit/unit.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UnitStackConfigurationBaseDTO } from '../dtos/unit-stack-configuration.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';

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

  describe('Import Unit Stack Checks', () => {
    describe('Check3', () => {
      it('Should pass given aligned unit stack config and unit data', () => {
        const unitStackConfig = new UnitStackConfigurationBaseDTO();
        unitStackConfig.unitId = 'TEST';
        unitStackConfig.stackPipeId = 'TEST';

        const location = new UpdateMonitorLocationDTO();
        location.unitId = 'TEST';
        location.stackPipeId = 'TEST';

        const plan = new UpdateMonitorPlanDTO();
        plan.unitStackConfigurations = [unitStackConfig];
        plan.locations = [location];

        const result = service.runUnitStackChecks(plan);
        expect(result.length).toBe(0);
      });

      it('Should fail given unit stack not in unit stack config', () => {
        const unitStackConfig = new UnitStackConfigurationBaseDTO();
        unitStackConfig.unitId = 'TEST';
        unitStackConfig.stackPipeId = 'TEST';

        const location = new UpdateMonitorLocationDTO();
        location.unitId = 'TEST';
        location.stackPipeId = 'TESTING';

        const location2 = new UpdateMonitorLocationDTO();
        location2.unitId = 'TEST';
        location2.stackPipeId = 'TEST';

        const plan = new UpdateMonitorPlanDTO();
        plan.unitStackConfigurations = [unitStackConfig];
        plan.locations = [location, location2];

        const result = service.runUnitStackChecks(plan);
        expect(result).toEqual([
          '[IMPORT3-FATAL-A] Each stack or pipe must be associated with at least one unit. StackName TESTING is not associated with any units.',
        ]);
      });
    });
    describe('Check4', () => {
      it('Should fail given unit not in unit stack config when there are more than 1 units present', () => {
        const unitStackConfig = new UnitStackConfigurationBaseDTO();
        unitStackConfig.unitId = 'TEST';
        unitStackConfig.stackPipeId = 'TEST';

        const location = new UpdateMonitorLocationDTO();
        location.unitId = 'TESTING';
        location.stackPipeId = 'TEST';

        const location2 = new UpdateMonitorLocationDTO();
        location2.unitId = 'TEST';
        location2.stackPipeId = 'TEST';

        const plan = new UpdateMonitorPlanDTO();
        plan.unitStackConfigurations = [unitStackConfig];
        plan.locations = [location, location2];

        const result = service.runUnitStackChecks(plan);
        expect(result).toEqual([
          '[IMPORT4-FATAL-A] Each unit must be associated with at least one unit record. Unit Name TESTING is not associated with any unit record',
        ]);
      });
    });
    describe('Check8', () => {
      it('Should fail given unit stack config stackId not in location', () => {
        const unitStackConfig = new UnitStackConfigurationBaseDTO();
        unitStackConfig.unitId = 'TEST';
        unitStackConfig.stackPipeId = 'TEST';

        const unitStackConfig2 = new UnitStackConfigurationBaseDTO();
        unitStackConfig2.unitId = 'TEST';
        unitStackConfig2.stackPipeId = 'TESTING';

        const location = new UpdateMonitorLocationDTO();
        location.unitId = 'TEST';
        location.stackPipeId = 'TEST';

        const plan = new UpdateMonitorPlanDTO();
        plan.unitStackConfigurations = [unitStackConfig, unitStackConfig2];
        plan.locations = [location];

        const result = service.runUnitStackChecks(plan);
        expect(result).toEqual([
          `[IMPORT8-CRIT1-A] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. StackPipeID TESTING was not associated with a Stack/Pipe record in the file.`,
        ]);
      });
    });

    describe('Check8', () => {
      it('Should fail given unit stack config unitId not in location', () => {
        const unitStackConfig = new UnitStackConfigurationBaseDTO();
        unitStackConfig.unitId = 'TEST';
        unitStackConfig.stackPipeId = 'TEST';

        const unitStackConfig2 = new UnitStackConfigurationBaseDTO();
        unitStackConfig2.unitId = 'TESTING';
        unitStackConfig2.stackPipeId = 'TEST';

        const location = new UpdateMonitorLocationDTO();
        location.unitId = 'TEST';
        location.stackPipeId = 'TEST';

        const plan = new UpdateMonitorPlanDTO();
        plan.unitStackConfigurations = [unitStackConfig, unitStackConfig2];
        plan.locations = [location];

        const result = service.runUnitStackChecks(plan);
        expect(result).toEqual([
          `[IMPORT8-CRIT1-B] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. UnitID TESTING was not associated with a Unit record in the file. This StackPipe Configuration Record was not imported.`,
        ]);
      });
    });
  });

  /*
  describe('importUnitStack', () => {
    it('Should create new record given an undefined one', async () => {
      const plan = new UpdateMonitorPlanDTO();
      plan.unitStackConfigurations = [new UnitStackConfigurationBaseDTO()];
      await service.importUnitStack(plan, 1, '');
      expect(repo.create).toHaveBeenCalled();
    });
  });
  */

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
