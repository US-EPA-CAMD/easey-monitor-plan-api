import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitControl } from '../entities/workspace/unit-control.entity';
import { UnitControlBaseDTO } from '../dtos/unit-control.dto';
import { UnitControlChecksService } from './unit-control-checks.service';
import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { UnitRepository } from '../unit/unit.repository';

const unitId = 1;
const locId = '1';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

describe('Unit Control Check Service Test', () => {
  let service: UnitControlChecksService;
  let repository: UnitControlWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitControlChecksService,
        {
          provide: UnitControlWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
        {
          provide: MonitorLocationWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
        {
          provide: UnitRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get(UnitControlChecksService);
    repository = module.get(UnitControlWorkspaceRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Unit Control Checks', () => {
    const payload = new UnitControlBaseDTO();
    it('Should pass all checks', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(service, 'checkDatesForConsistency').mockReturnValue(null);
      const result = await service.runChecks(locId, unitId, payload);

      expect(result).toEqual([]);
    });
  });

  describe('CONTROL-15 Duplicate Unit Control (Result A)', () => {
    const payload = new UnitControlBaseDTO();
    payload.parameterCode = 'LOW';

    const returnValue = new UnitControl();
    returnValue.parameterCode = 'LOW';

    it('Should get already exists error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(returnValue);
      jest.spyOn(service, 'checkDatesForConsistency').mockReturnValue(null);
      try {
        await service.runChecks(locId, unitId, payload);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('Test checkDatesForConsistency', () => {
    it('Should throw error for invalid Optimization Date', async () => {
      const dto = new UnitControlBaseDTO();
      const errorList = [];
      dto.originalCode = '1';
      dto.retireDate = new Date('2023-04-02');
      dto.optimizationDate = new Date('2023-04-01');
      service.checkDatesForConsistency(dto, errorList);
      expect(errorList.length).toEqual(0);

      dto.optimizationDate = new Date('2023-04-15'); // Invalid, after RetireDate
      service.checkDatesForConsistency(dto, errorList);
      expect(errorList.length).toEqual(1);
    });

    it('Should throw error for Null Install Date When originalCode = 1', async () => {
      const dto = new UnitControlBaseDTO();
      const errorList = [];
      dto.originalCode = '1';
      service.checkDatesForConsistency(dto, errorList);
      expect(errorList.length).toEqual(0);

      dto.originalCode = '0';
      service.checkDatesForConsistency(dto, errorList);
      expect(errorList.length).toEqual(1);
    });

    it('Should throw error for Non-null Install Date when originalcode != 1', async () => {
      const dto = new UnitControlBaseDTO();
      const errorList = [];
      dto.installDate = new Date('2023-04-01');
      dto.originalCode = '0';
      service.checkDatesForConsistency(dto, errorList);
      expect(errorList.length).toEqual(0);

      dto.originalCode = '1';
      service.checkDatesForConsistency(dto, errorList);
      expect(errorList.length).toEqual(1);
    });
  });
});
