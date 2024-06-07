import { Test } from '@nestjs/testing';
import { CheckCatalogService } from '@us-epa-camd/easey-common';

import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';
import { MonitorFormulaBaseDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaChecksService } from './monitor-formula-checks.service';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const locationId = 'locationId';
const monitorFormulaBaseDTO = new MonitorFormulaBaseDTO();
const monitorFormula = new MonitorFormula();

const mockRepository = () => ({
  getFormula: jest.fn().mockResolvedValue(Promise.resolve(monitorFormula)),
  getFormulaByLocIdAndFormulaIdentifier: jest
    .fn()
    .mockResolvedValue(monitorFormula),
});

describe('Monitoring Formula Check Service Test', () => {
  let service: MonitorFormulaChecksService;
  let repository: MonitorFormulaWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorFormulaChecksService,
        {
          provide: MonitorFormulaWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MonitorFormulaChecksService);
    repository = module.get(MonitorFormulaWorkspaceRepository);
    jest
      .spyOn(CheckCatalogService, 'formatResultMessage')
      .mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Creating a new formula', () => {
    it('Should get [FORMULA-18-A] error when a duplicate formulaId is provided', async () => {
      jest
        .spyOn(repository, 'getFormulaByLocIdAndFormulaIdentifier')
        .mockResolvedValue(new MonitorFormula());
      try {
        await service.runChecks(monitorFormulaBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual(JSON.stringify([MOCK_ERROR_MSG]));
      }
    });
  });

  describe('Updating an existing formula', () => {
    it('Should get [FORMULA-18-A] error when the formulaId is updated to one that is already in use', async () => {
      jest
        .spyOn(repository, 'getFormulaByLocIdAndFormulaIdentifier')
        .mockResolvedValue(new MonitorFormula());
      try {
        await service.runChecks(monitorFormulaBaseDTO, locationId);
      } catch (err) {
        expect(err.response.message).toEqual(JSON.stringify([MOCK_ERROR_MSG]));
      }
    });

    it('Should not get an error when the formulaId is updated to the same value', async () => {
      const testRecordId = 'TEST';
      jest
        .spyOn(repository, 'getFormulaByLocIdAndFormulaIdentifier')
        .mockResolvedValue({
          ...monitorFormula,
          id: testRecordId,
        } as MonitorFormula);
      const errors = await service.runChecks(
        monitorFormulaBaseDTO,
        locationId,
        testRecordId,
      );
      expect(errors).toEqual([]);
    });
  });
});
