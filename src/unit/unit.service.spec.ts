import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { Unit } from '../entities/unit.entity';
import { UnitRepository } from './unit.repository';
import { UnitService } from './unit.service';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
  findOne: jest.fn().mockResolvedValue(''),
  update: jest.fn().mockResolvedValue(true),
});

describe('Unit Import Tests', () => {
  let service: UnitService;
  let repository: UnitRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitService,
        {
          provide: UnitRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    repository = module.get(UnitRepository);
    service = module.get(UnitService);
  });

  describe('Check2', () => {
    it('Should pass given a returned entry for facilityId and unitId present in location', async () => {
      repository.findOne = jest.fn().mockResolvedValue(new Unit());

      const location = new UpdateMonitorLocationDTO();

      const result = await service.runUnitChecks(location, 1, 1);

      expect(result).toEqual([]);
    });

    it('Should error given a undefined entry for facilityId and unitId in unitStackConfigurations', async () => {
      repository.findOne = jest.fn().mockResolvedValue(undefined);

      const location = new UpdateMonitorLocationDTO();
      location.unitId = '1';

      const result = await service.runUnitChecks(location, 1, 1);

      expect(result).toEqual([
        "[IMPORT2-FATAL-A] The database doesn't contain unit 1 for Oris Code 1",
      ]);
    });

    it('Should pass return true when record is updated', async () => {
      repository.update = jest.fn().mockResolvedValue(new Unit());
      const unit = new Unit();

      const result = await service.importUnit(unit, 1);
      console.log(result);
      expect(result).toEqual(true);
    });

    it('Should pass return true when record is updated', async () => {
      repository.findOne = jest.fn().mockResolvedValue(new Unit());
      const unit = new Unit();

      const result = await service.getUnitByNameAndFacId('1', 1);
      console.log(result);
      expect(result).toEqual(unit);
    });
  });
});
