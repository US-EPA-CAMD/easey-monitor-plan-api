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
      const result = await service.runChecks(payload, unitId, locId);

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
      try {
        await service.runChecks(payload, unitId, locId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
