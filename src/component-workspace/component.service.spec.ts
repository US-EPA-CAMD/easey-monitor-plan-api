import { Test, TestingModule } from '@nestjs/testing';

import { ComponentMap } from '../maps/component.map';
import { ComponentWorkspaceService } from './component.service';
import { ComponentWorkspaceRepository } from './component.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { Component } from '../entities/component.entity';
import { UpdateComponentBaseDTO } from '../dtos/component.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { AnalyzerRangeBaseDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeWorkspaceModule } from '../analyzer-range-workspace/analyzer-range.module';
import { AnalyzerRangeWorkspaceService } from '../analyzer-range-workspace/analyzer-range.service';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
  findOne: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('ComponentWorkspaceService', () => {
  let service: ComponentWorkspaceService;
  let repository: ComponentWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ComponentWorkspaceService,
        {
          provide: AnalyzerRangeWorkspaceService,
          useFactory: jest.fn(),
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: mockRepository,
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
        comp.analyzerRanges = [];
        repository.findOne = jest.fn().mockResolvedValue(comp);

        const location = new UpdateMonitorLocationDTO();
        const component = new UpdateComponentBaseDTO();

        component.componentTypeCode = 'SO2';
        component.basisCode = null;
        component.analyzerRanges = [];

        location.components = [component];

        const checkResults = await service.runComponentChecks(
          [component],
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
        repository.findOne = jest.fn().mockResolvedValue(comp);

        const location = new UpdateMonitorLocationDTO();
        const component = new UpdateComponentBaseDTO();

        component.componentTypeCode = 'SO2';
        component.basisCode = 'VALID';
        component.analyzerRanges = [];

        location.components = [component];

        const checkResults = await service.runComponentChecks(
          [component],
          location,
          '1',
        );

        expect(checkResults).toEqual([
          '[IMPORT6-CRIT1-A]The moisture basis VALID for ComponentID undefined in UnitStackPipeID undefined/undefined does not match the moisture basis in the Workspace database.',
        ]);
      });

      it('Should pass with matching basis type code and matching componentTypeCode', async () => {
        const comp = new Component();
        comp.componentTypeCode = 'SO2';
        comp.basisCode = 'VALID';
        comp.analyzerRanges = [];
        repository.findOne = jest.fn().mockResolvedValue(comp);

        const location = new UpdateMonitorLocationDTO();
        const component = new UpdateComponentBaseDTO();

        component.componentTypeCode = 'SO2';
        component.basisCode = 'VALID';
        component.analyzerRanges = [];

        location.components = [component];

        const checkResults = await service.runComponentChecks(
          [component],
          location,
          '1',
        );

        expect(checkResults).toEqual([]);
      });

      describe('Check32', () => {
        it('Should fail with invalid component type code and analyzer range data', async () => {
          const comp = new Component();
          comp.componentTypeCode = 'ERR';
          comp.analyzerRanges = [];
          repository.findOne = jest.fn().mockResolvedValue(comp);

          const location = new UpdateMonitorLocationDTO();
          const component = new UpdateComponentBaseDTO();

          component.componentTypeCode = 'ERR';
          component.basisCode = null;
          component.analyzerRanges = [new AnalyzerRangeBaseDTO()];

          location.components = [component];

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
          repository.findOne = jest.fn().mockResolvedValue(undefined);

          const location = new UpdateMonitorLocationDTO();
          const component = new UpdateComponentBaseDTO();

          component.componentTypeCode = 'ERR';
          component.basisCode = null;
          component.analyzerRanges = [new AnalyzerRangeBaseDTO()];

          location.components = [component];

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComponents', () => {
    it('should return array of components', async () => {
      const result = await service.getComponents(null);
      expect(result).toEqual('');
    });
  });
});
