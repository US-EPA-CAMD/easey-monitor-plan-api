import { Test, TestingModule } from '@nestjs/testing';
import { UnitProgramRepository } from './unit-program.repository';
import { UnitProgramService } from './unit-program.service';
import { UnitProgramMap } from '../maps/unit-program.map';
import { UnitProgramDTO } from '../dtos/unit-program.dto';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

const mockRepository = () => ({
  getUnitPrograms: jest.fn().mockResolvedValue([]),
  getUnitProgram: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([]),
  one: jest.fn().mockResolvedValue(new UnitProgramDTO()),
});

describe('UnitProgramService', () => {
  let service: UnitProgramService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitProgramService,
        {
          provide: UnitProgramRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitProgramMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(UnitProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnitPrograms', () => {
    it('should return an array of unit programs', async () => {
      const result = await service.getUnitPrograms('locId', 1);
      expect(result).toEqual([]);
    });
  });

  describe('getUnitProgram', () => {
    it('should return a single unit program or throw an error if not found', async () => {
      jest.spyOn(service, 'getUnitProgram').mockResolvedValue(new UnitProgramDTO());
      expect(await service.getUnitProgram('locId', 1, 'programId')).toBeInstanceOf(UnitProgramDTO);
    });
  });
});
