import { Test, TestingModule } from '@nestjs/testing';

import { ComponentMap } from '../maps/component.map';
import { ComponentWorkspaceService } from './component.service';
import { ComponentWorkspaceRepository } from './component.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { Component } from '../entities/workspace/component.entity';
import { ComponentDTO, UpdateComponentBaseDTO } from '../dtos/component.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { AnalyzerRangeBaseDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeWorkspaceService } from '../analyzer-range-workspace/analyzer-range.service';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const userId = 'testUser';
const locationId = '1';
const componentID = 'SO2';
const component = new Component();
component.id = 'uuid';
const componentDto = new ComponentDTO();

const payload = new UpdateComponentBaseDTO();
payload.componentId = '';
payload.modelVersion = '';
payload.serialNumber = '';
payload.manufacturer = '';
payload.componentTypeCode = '';
payload.sampleAcquisitionMethodCode = '';
payload.basisCode = '';
payload.hgConverterIndicator = 1;

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([component]),
  findBy: jest.fn().mockResolvedValue([component]),
  findOneBy: jest.fn().mockResolvedValue(component),
  save: jest.fn().mockResolvedValue(component),
  create: jest.fn().mockResolvedValue(component),
  getComponentByLocIdAndCompId: jest.fn().mockResolvedValue(component),
});

const mockUsedIdRepo = () => ({
  getBySpecs: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(componentDto),
  many: jest.fn().mockResolvedValue([componentDto]),
});

describe('ComponentWorkspaceService', () => {
  let service: ComponentWorkspaceService;
  let repository: ComponentWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ComponentWorkspaceService,
        MonitorPlanWorkspaceService,

        {
          provide: AnalyzerRangeWorkspaceService,
          useFactory: () => ({
            importAnalyzerRange: jest.fn(),
          }),
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UsedIdentifierRepository,
          useFactory: mockUsedIdRepo,
        },
        {
          provide: ComponentMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    repository = module.get(ComponentWorkspaceRepository);
    service = module.get(ComponentWorkspaceService);
  });

  describe('Component Import Tests', () => {
    describe('Check6', () => {
      it('Should fail with component type code not matching db component type code', async () => {
        const comp = new Component();
        comp.componentTypeCode = 'NOX';
        comp.basisCode = null;
        comp.analyzerRanges = [];

        jest.spyOn(repository, 'findOneBy').mockResolvedValue(comp);

        const location = new UpdateMonitorLocationDTO();
        const componentDto = new UpdateComponentBaseDTO();

        componentDto.componentTypeCode = 'SO2';
        componentDto.basisCode = null;
        componentDto.analyzerRangeData = [];

        location.componentData = [componentDto];

        const checkResults = await service.runComponentChecks(
          [componentDto],
          location,
          '1',
        );

        expect(checkResults).toEqual([
          '[IMPORT6-CRIT1-A] The component type SO2 for ComponentID undefined in UnitStackPipeID undefined/undefined does not match the component type in the Workspace database.',
        ]);
      });

      it('Should fail with basis code not matching db basis code', async () => {
        const comp = new Component();
        comp.componentTypeCode = 'SO2';
        comp.basisCode = 'ERR';
        comp.analyzerRanges = [];
        repository.findOneBy = jest.fn().mockResolvedValue(comp);

        const location = new UpdateMonitorLocationDTO();
        const component = new UpdateComponentBaseDTO();

        component.componentTypeCode = 'SO2';
        component.basisCode = 'VALID';
        component.analyzerRangeData = [];

        location.componentData = [component];

        const checkResults = await service.runComponentChecks(
          [component],
          location,
          '1',
        );

        expect(checkResults).toEqual([
          '[IMPORT6-CRIT1-B]The moisture basis VALID for ComponentID undefined in UnitStackPipeID undefined/undefined does not match the moisture basis in the Workspace database.',
        ]);
      });

      it('Should pass with matching basis type code and matching componentTypeCode', async () => {
        const comp = new Component();
        comp.componentTypeCode = 'SO2';
        comp.basisCode = 'VALID';
        comp.analyzerRanges = [];
        repository.findOneBy = jest.fn().mockResolvedValue(comp);

        const location = new UpdateMonitorLocationDTO();
        const component = new UpdateComponentBaseDTO();

        component.componentTypeCode = 'SO2';
        component.basisCode = 'VALID';
        component.analyzerRangeData = [];

        location.componentData = [component];

        const checkResults = await service.runComponentChecks(
          [component],
          location,
          '1',
        );

        expect(checkResults).toEqual([]);
      });
    });

    describe('Check32', () => {
      it('Should fail with invalid component type code and analyzer range data', async () => {
        const comp = new Component();
        comp.componentTypeCode = 'ERR';
        comp.basisCode = null;
        comp.analyzerRanges = [];
        repository.findOneBy = jest.fn().mockResolvedValue(comp);

        const location = new UpdateMonitorLocationDTO();
        const component = new UpdateComponentBaseDTO();

        component.componentTypeCode = 'ERR';
        component.basisCode = null;
        component.analyzerRangeData = [new AnalyzerRangeBaseDTO()];

        location.componentData = [component];

        const checkResults = await service.runComponentChecks(
          [component],
          location,
          '1',
        );

        expect(checkResults).toEqual([
          '[IMPORT32-CRIT1-A] You have reported an AnalyzerRange record for a component with an inappropriate ComponentTypeCode.',
        ]);
      });

      it('Should fail with invalid component type code in the file and analyzer range data', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

        const location = new UpdateMonitorLocationDTO();
        const component = new UpdateComponentBaseDTO();

        component.componentTypeCode = 'ERR';
        component.basisCode = null;
        component.analyzerRangeData = [new AnalyzerRangeBaseDTO()];

        location.componentData = [component];

        const checkResults = await service.runComponentChecks(
          [component],
          location,
          '1',
        );

        expect(checkResults).toEqual([
          '[IMPORT32-CRIT1-A] You have reported an AnalyzerRange record for a component with an inappropriate ComponentTypeCode.',
        ]);
      });

      it('Should fail with invalid component type code in the database and analyzer range data', async () => {
        const comp = new Component();
        comp.componentTypeCode = 'ERR';
        comp.basisCode = null;
        comp.analyzerRanges = [new AnalyzerRange()];
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(comp);

        const location = new UpdateMonitorLocationDTO();
        const component = new UpdateComponentBaseDTO();

        component.componentTypeCode = 'ERR';
        component.basisCode = null;
        component.analyzerRangeData = [new AnalyzerRangeBaseDTO()];

        location.componentData = [component];

        const checkResults = await service.runComponentChecks(
          [component],
          location,
          '1',
        );

        expect(checkResults).toEqual([
          '[IMPORT32-CRIT1-A] You have reported an AnalyzerRange record for a component with an inappropriate ComponentTypeCode.',
        ]);
      });
    });
  });

  describe('getComponents', () => {
    it('should return array of components', async () => {
      const result = await service.getComponents(locationId);
      expect(result).toEqual([componentDto]);
    });
  });

  describe('getComponentByIdentifier', () => {
    it('should return a component by locationId and Component ID', async () => {
      const result = await service.getComponentByIdentifier(
        locationId,
        componentID,
      );
      expect(result).toEqual(componentDto);
    });
    it('should return null when component not found by locationId and Component ID', async () => {
      jest
        .spyOn(repository, 'getComponentByLocIdAndCompId')
        .mockResolvedValueOnce(undefined);
      const result = await service.getComponentByIdentifier(
        locationId,
        componentID,
      );
      expect(result).toEqual(null);
    });
  });

  describe('createComponent', () => {
    it('should create and return a component dto', async () => {
      const response = await service.createComponent(
        locationId,
        payload,
        userId,
      );
      expect(response).toEqual(componentDto);
    });
  });

  describe('updateComponent', () => {
    it('should update and return updated component dto', async () => {
      const response = await service.updateComponent(
        locationId,
        component,
        payload,
        userId,
      );
      expect(response).toEqual(componentDto);
    });
  });

  describe('importUnitStack', () => {
    const location = new UpdateMonitorLocationDTO();
    location.componentData = [payload];
    it('should update while importing a component', async () => {
      const response = await service.importComponent(
        location,
        locationId,
        userId,
      );
      expect(response).toEqual(true);
    });

    it('should create while importing a component if records does not exists', async () => {
      jest
        .spyOn(repository, 'getComponentByLocIdAndCompId')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(component);

      const response = await service.importComponent(
        location,
        locationId,
        userId,
      );
      expect(response).toEqual(true);
    });
  });
});
