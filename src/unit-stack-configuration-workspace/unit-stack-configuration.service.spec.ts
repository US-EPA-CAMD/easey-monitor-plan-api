import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { StackPipeService } from '../stack-pipe/stack-pipe.service';
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

mpPayload.unitStackConfigurations = [unitStackConfig];
mpPayload.locations = [location];

const mockRepository = () => ({
  getUnitStackById: jest.fn().mockResolvedValue(unitStack),
  save: jest.fn().mockResolvedValue(unitStack),
  find: jest.fn().mockResolvedValue(unitStack),
  findOne: jest.fn().mockResolvedValue(undefined),
  update: jest.fn(),
  create: jest.fn().mockResolvedValue('Why'),
  getUnitStackConfigsByLocationIds: jest.fn().mockResolvedValue([unitStack]),
  getUnitStackByUnitIdStackIdBDate: jest.fn().mockResolvedValue(unitStack),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([unitStackDto]),
  one: jest.fn().mockResolvedValue(unitStackDto),
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

  describe('importUnitStack', () => {
    it('should update while importing unit stack config', async () => {
      const response = await service.importUnitStack(
        mpPayload,
        facilityId,
        userId,
      );
      expect(response).toEqual(true);
    });

    it('should create while importing unit stack config if records does not exists', async () => {
      jest
        .spyOn(repo, 'getUnitStackByUnitIdStackIdBDate')
        .mockResolvedValue(undefined);

      const response = await service.importUnitStack(
        mpPayload,
        facilityId,
        userId,
      );
      expect(response).toEqual(true);
    });
  });
});
