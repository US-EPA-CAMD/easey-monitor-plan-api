import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';
import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';
import { UpdateMonitorFormulaDTO } from '../dtos/monitor-formula-update.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new MonitorFormula()),
  create: jest.fn().mockResolvedValue(new MonitorFormula()),
  save: jest.fn().mockResolvedValue(new MonitorFormula()),
  getFormula: jest.fn().mockResolvedValue(new MonitorFormula()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

const locationId = '5770';
const formulaId = 'someId';
const userId = 'testuser';

const monitorFormulaDTO: UpdateMonitorFormulaDTO = {
  formulaId: 'string',
  parameterCode: 'string',
  formulaCode: 'string',
  formulaText: 'string',
  beginDate: new Date(Date.now()),
  beginHour: 1,
  endDate: new Date(Date.now()),
  endHour: 1,
};

describe('MonitorFormulaWorkspaceService', () => {
  let service: MonitorFormulaWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        MonitorFormulaWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorFormulaWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorFormulaMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorFormulaWorkspaceService);
  });

  describe('getFormulas', () => {
    it('calls the MatsMehtodWorkspaceRepository.find() gets all formula codes for locationId', async () => {
      const result = await service.getFormulas(locationId);
      expect(result).toEqual([]);
    });
  });

  describe('getFormula', () => {
    it('should return an array of formulas', async () => {
      const result = await service.getFormula(locationId, formulaId);
      expect(result).toEqual({});
    });
  });

  describe('createFormula', () => {
    it('creates a FormulaCode data for a specified locationId', async () => {
      const result = await service.createFormula(
        locationId,
        monitorFormulaDTO,
        userId,
      );
      expect(result).toEqual({});
    });
  });

  describe('updateMetod', () => {
    it('updates a FormulaCode data for a specified locationId', async () => {
      const result = await service.updateFormula(
        formulaId,
        locationId,
        monitorFormulaDTO,
        userId,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
