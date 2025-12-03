import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitDTO } from '../dtos/unit.dto';
import { UnitMap } from '../maps/unit.map';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { StackPipeWorkspaceService } from '../stack-pipe-workspace/stack-pipe.service';
import { UnitService } from '../unit/unit.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import {
  UnitStackConfigurationBaseDTO,
  UnitStackConfigurationDTO,
} from '../dtos/unit-stack-configuration.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';

const userId = 'testUser';
const locationId = '1';
const facilityId = 1;
const unitID = '51';
const unitRecordId = 'uuid';
const stackPipeID = 'CS0AN';
const unitStack = new UnitStackConfiguration();
const unitStackDto = new UnitStackConfigurationDTO();
const unitDto = new UnitDTO();

const payload = new UnitStackConfigurationBaseDTO();
payload.beginDate = new Date();
payload.endDate = new Date();

const mpPayload = new UpdateMonitorPlanDTO();
const location = new UpdateMonitorLocationDTO();
location.stackPipeId = stackPipeID;
location.unitId = unitID;
const unitStackConfig = new UnitStackConfigurationBaseDTO();
unitStackConfig.stackPipeId = stackPipeID;
unitStackConfig.unitId = unitID;

mpPayload.unitStackConfigurationData = [unitStackConfig];
mpPayload.monitoringLocationData = [location];

// Mock CheckCatalogService
jest.mock('@us-epa-camd/easey-common', () => ({
  CheckCatalogService: {
    formatResultMessage: jest.fn().mockImplementation((code, params) => {
      if (code === 'MONLOC-107-A') {
        return '[MONLOC-107-A]';
      }
      if (code === 'MONLOC-107-B') {
        return '[MONLOC-107-B]';
      }
      if (code === 'IMPORT-4-A') {
        return '[IMPORT-4-A]';
      }
      return `[${code}]`;
    }),
  },
}));

const mockRepository = () => ({
  getUnitStackById: jest.fn().mockResolvedValue(unitStack),
  save: jest.fn().mockResolvedValue(unitStack),
  find: jest.fn().mockResolvedValue([unitStack]),
  findOne: jest.fn().mockResolvedValue(undefined),
  update: jest.fn(),
  create: jest.fn().mockResolvedValue('Why'),
  getUnitStackConfigsByLocationIds: jest.fn().mockResolvedValue([unitStack]),
  getUnitStackConfigByUnitIdStackId: jest.fn().mockResolvedValue(null), // Default to null for tests
  findOneBy: jest.fn().mockResolvedValue(undefined),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([unitStackDto]),
  one: jest.fn().mockResolvedValue(unitStackDto),
});

const mockStackPipe = () => ({
  getStackByNameAndFacId: jest.fn().mockResolvedValue({
    id: 'stack-id',
    name: 'TEST',
  }),
});

const mockUnit = () => ({
  getUnitByNameAndFacId: jest.fn().mockResolvedValue({
    id: 1,
    name: 'TEST',
  }),
});
const mockUnitMap = () => ({
  many: jest.fn().mockResolvedValue([unitDto]),
  one: jest.fn().mockResolvedValue(unitDto),
});

describe('UnitStackConfigurationWorkspaceService', () => {
  let service: UnitStackConfigurationWorkspaceService;
  let repo: UnitStackConfigurationWorkspaceRepository;
  let stackPipeService: StackPipeWorkspaceService;
  let unitService: UnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitStackConfigurationWorkspaceService,
        {
          provide: StackPipeWorkspaceService,
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
        {
          provide: UnitMap,
          useFactory: mockUnitMap,
        },
      ],
    }).compile();

    repo = module.get<UnitStackConfigurationWorkspaceRepository>(
      UnitStackConfigurationWorkspaceRepository,
    );
    service = module.get<UnitStackConfigurationWorkspaceService>(
      UnitStackConfigurationWorkspaceService,
    );
    stackPipeService = module.get<StackPipeWorkspaceService>(
      StackPipeWorkspaceService,
    );
    unitService = module.get<UnitService>(UnitService);
  });

  describe('getUnitStackConfigsByLocationIds', () => {
    it('should return unit stacks by Location Ids', async () => {
      const response = await service.getUnitStackConfigsByLocationIds([
        locationId,
      ]);
      expect(response).toEqual([unitStack]);
    });
  });

  // describe('getUnitStackRelationships', () => {
  //   it('should return unit stack config by unit relationship ', async () => {
  //     const response = await service.getUnitStackRelationships(true, unitID);
  //     expect(response).toEqual([unitStackDto]);
  //   });

  //   it('should return unit stack config by unit relationship ', async () => {
  //     const response = await service.getUnitStackRelationships(
  //       false,
  //       stackPipeID,
  //     );
  //     expect(response).toEqual([unitStackDto]);
  //   });
  // });

  describe('createUnitStackConfig', () => {
    it('should create and return unit stack config dto', async () => {
      const response = await service.createUnitStackConfig(
        51,
        stackPipeID,
        payload,
        userId,
      );
      expect(response).toEqual(unitStackDto);
    });
  });

  describe('updateUnitStackConfig', () => {
    it('should update and return updated unit stack config dto', async () => {
      const response = await service.updateUnitStackConfig(
        unitRecordId,
        payload,
        userId,
      );
      expect(response).toEqual(unitStackDto);
    });
  });

  describe('Import Unit Stack Checks', () => {
    describe('Check3', () => {
      it('Should pass given aligned unit stack config and unit data', async () => {
        const unitStackConfig = new UnitStackConfigurationBaseDTO();
        unitStackConfig.unitId = 'TEST';
        unitStackConfig.stackPipeId = 'TEST';

        const location = new UpdateMonitorLocationDTO();
        location.unitId = 'TEST';
        location.stackPipeId = 'TEST';

        const plan = new UpdateMonitorPlanDTO();
        plan.unitStackConfigurationData = [unitStackConfig];
        plan.monitoringLocationData = [location];

        const result = await service.runUnitStackChecks(plan, facilityId);
        expect(result.length).toBe(0);
      });

      it('Should fail given unit stack not in unit stack config', async () => {
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
        plan.unitStackConfigurationData = [unitStackConfig];
        plan.monitoringLocationData = [location, location2];

        const result = await service.runUnitStackChecks(plan, facilityId);
        expect(result).toEqual([
          '[IMPORT3-FATAL-A] Each stack or pipe must be associated with at least one unit. StackName TESTING is not associated with any units.',
        ]);
      });
    });
    // describe('Check4', () => {
    //   it('Should fail given unit not in unit stack config when there are more than 1 units present', () => {
    //     const unitStackConfig = new UnitStackConfigurationBaseDTO();
    //     unitStackConfig.unitId = 'TEST';
    //     unitStackConfig.stackPipeId = 'TEST';

    //     const location = new UpdateMonitorLocationDTO();
    //     location.unitId = 'TESTING';
    //     location.stackPipeId = 'TEST';

    //     const location2 = new UpdateMonitorLocationDTO();
    //     location2.unitId = 'TEST';
    //     location2.stackPipeId = 'TEST';

    //     const plan = new UpdateMonitorPlanDTO();
    //     plan.unitStackConfigurations = [unitStackConfig];
    //     plan.locations = [location, location2];

    //     const result = service.runUnitStackChecks(plan);
    //     expect(result).toEqual([
    //       '[IMPORT4-FATAL-A] Each unit must be associated with at least one unit record. Unit Name TESTING is not associated with any unit record',
    //     ]);
    //   });
    // });
    describe('Check8', () => {
      it('Should fail given unit stack config stackId not in location', async () => {
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
        plan.unitStackConfigurationData = [unitStackConfig, unitStackConfig2];
        plan.monitoringLocationData = [location];

        const result = await service.runUnitStackChecks(plan, facilityId);
        expect(result).toEqual([
          `[IMPORT8-CRIT1-A] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. StackPipeID TESTING was not associated with a Stack/Pipe record in the file.`,
        ]);
      });
    });

    describe('Check8', () => {
      it('Should fail given unit stack config unitId not in location', async () => {
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
        plan.unitStackConfigurationData = [unitStackConfig, unitStackConfig2];
        plan.monitoringLocationData = [location];

        const result = await service.runUnitStackChecks(plan, facilityId);
        expect(result).toEqual([
          `[IMPORT8-CRIT1-B] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. UnitID TESTING was not associated with a Unit record in the file. This StackPipe Configuration Record was not imported.`,
        ]);
      });
    });
  });

  describe('importUnitStacks', () => {
    it('should update while importing unit stack config', async () => {
      jest
        .spyOn(repo, 'getUnitStackConfigByUnitIdStackId')
        .mockResolvedValue(unitStack);

      const response = await service.importUnitStacks(
        mpPayload,
        facilityId,
        userId,
      );
      expect(response).toEqual([unitStackDto]);
    });

    it('should create while importing unit stack config if records does not exists', async () => {
      jest
        .spyOn(repo, 'getUnitStackConfigByUnitIdStackId')
        .mockResolvedValue(undefined);

      const response = await service.importUnitStacks(
        mpPayload,
        facilityId,
        userId,
      );
      expect(response).toEqual([unitStackDto]);
    });
  });

  describe('MONLOC-107 check', () => {
    it('should return MONLOC-107-A error when unitId is missing in unit stack configuration', async () => {
      const unitStackConfig = new UnitStackConfigurationBaseDTO();
      unitStackConfig.unitId = null;
      unitStackConfig.stackPipeId = 'TEST';

      const plan = new UpdateMonitorPlanDTO();
      plan.unitStackConfigurationData = [unitStackConfig];
      plan.monitoringLocationData = [];

      const result = await service.runUnitStackChecks(plan, facilityId);

      expect(result).toContain('[MONLOC-107-A]');
    });

    it('should return MONLOC-107-B error when duplicate unit stack configuration exists in database', async () => {
      jest
        .spyOn(repo, 'getUnitStackConfigByUnitIdStackId')
        .mockResolvedValue(unitStack);

      const unitStackConfig1 = new UnitStackConfigurationBaseDTO();
      unitStackConfig1.unitId = 'TEST';
      unitStackConfig1.stackPipeId = 'CS0AN';
      unitStackConfig1.beginDate = new Date('2023-01-01');

      const location1 = new UpdateMonitorLocationDTO();
      location1.unitId = 'TEST';
      location1.stackPipeId = 'CS0AN';

      const plan = new UpdateMonitorPlanDTO();
      plan.unitStackConfigurationData = [unitStackConfig1];
      plan.monitoringLocationData = [location1];

      const result = await service.runUnitStackChecks(plan, facilityId);
      const monloc107BErrors = result.filter(error => error.includes('MONLOC-107-B'));

      expect(monloc107BErrors.length).toBeGreaterThan(0);
      expect(monloc107BErrors[0]).toContain('[MONLOC-107-B]');
    });
  });

  describe('IMPORT-4-A check', () => {
    it('should return IMPORT-4-A error when unit has no stack configuration in multi-unit scenario', async () => {
      const plan = new UpdateMonitorPlanDTO();
      const location1 = new UpdateMonitorLocationDTO();
      location1.unitId = 'UNIT1';

      const location2 = new UpdateMonitorLocationDTO();
      location2.unitId = 'UNIT2';

      plan.monitoringLocationData = [location1, location2];

      const stackConfig = new UnitStackConfigurationBaseDTO();
      stackConfig.unitId = 'UNIT1';
      stackConfig.stackPipeId = 'STACK1';

      plan.unitStackConfigurationData = [stackConfig];

      const result = await service.importUnitStackConfigurationChecks(plan);

      expect(result).toContain('[IMPORT-4-A]');
    });
  });
});
