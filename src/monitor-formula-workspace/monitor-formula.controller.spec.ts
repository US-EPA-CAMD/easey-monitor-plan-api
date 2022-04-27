import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaWorkspaceController } from './monitor-formula.controller';
import { MonitorFormulaBaseDTO } from '../dtos/monitor-formula-update.dto';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

const locationId = 'string';
const methodId = 'string';
const matsFormulaPayload: MonitorFormulaBaseDTO = {
  formulaId: 'string',
  parameterCode: 'string',
  formulaCode: 'string',
  formulaText: 'string',
  beginDate: new Date(Date.now()),
  beginHour: 1,
  endDate: new Date(Date.now()),
  endHour: 1,
};

const mockMonitorFormulaWorkspaceService = () => ({
  getFormulas: jest.fn(() => []),
  getFormula: jest.fn(() => ({})),
  createFormula: jest.fn(() => ({})),
  updateFormula: jest.fn(() => ({})),
});

describe('MonitorFormulaWorkspaceController', () => {
  let controller: MonitorFormulaWorkspaceController;
  let service: MonitorFormulaWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorFormulaWorkspaceController],
      providers: [
        ConfigService,
        {
          provide: MonitorFormulaWorkspaceService,
          useFactory: mockMonitorFormulaWorkspaceService,
        },
      ],
    }).compile();

    controller = module.get<MonitorFormulaWorkspaceController>(
      MonitorFormulaWorkspaceController,
    );
    service = module.get<MonitorFormulaWorkspaceService>(
      MonitorFormulaWorkspaceService,
    );
  });

  describe('getFormulas', () => {
    it('should call the MonitorFormulaWorkspaceService.getFormulas', () => {
      expect(controller.getFormulas(locationId)).toEqual([]);
      expect(service.getFormulas).toHaveBeenCalled();
    });
  });

  describe('createFormula', () => {
    it('should call the MonitorFormulaWorkspaceService.createFormula', () => {
      expect(
        controller.createFormula(locationId, matsFormulaPayload, ''),
      ).toEqual({});
      expect(service.createFormula).toHaveBeenCalled();
    });
  });

  describe('createFormulas', () => {
    it('should call the MonitorFormulaWorkspaceService.updateFormula', () => {
      expect(
        controller.updateFormula(locationId, methodId, matsFormulaPayload, ''),
      ).toEqual({});
      expect(service.updateFormula).toHaveBeenCalled();
    });
  });
});
