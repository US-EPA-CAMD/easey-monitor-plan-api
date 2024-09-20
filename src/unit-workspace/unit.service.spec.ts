import { Test, TestingModule } from '@nestjs/testing';
import { UnitWorkspaceRepository } from './unit.repository';
import { UnitWorkspaceService } from './unit.service';
import { UnitMap } from '../maps/unit.map';
import { UnitDTO, UnitBaseDTO } from '../dtos/unit.dto';
import { EntityManager } from 'typeorm';
import { Unit } from '../entities/workspace/unit.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([]),
});

const mockRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(new UnitDTO()),
  save: jest.fn().mockResolvedValue({}),
});

const mockEntityManager = () => ({
  query: jest.fn().mockResolvedValue([]),
});

describe('UnitWorkspaceService', () => {
  let service: UnitWorkspaceService;
  let repository: UnitWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitWorkspaceService,
        {
          provide: UnitMap,
          useFactory: mockMap,
        },
        {
          provide: MonitorPlanWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn(),
          }),
        },
        {
          provide: UnitWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get(UnitWorkspaceService);
    repository = module.get(UnitWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnits', () => {
    it('should return an array of units', async () => {
      const result = await service.getUnits('locId', 1);
      expect(result).toEqual([]);
    });
  });

  describe('updateUnit', () => {
    it('should return the updated unit', async () => {
      const payload = new UnitBaseDTO();
      const unit: Unit = new Unit();
      const unitDetails: UnitDTO[] = [new UnitDTO(), new UnitDTO()]; // Mocked UnitDTO array

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(unit);
      jest.spyOn(repository, 'save').mockResolvedValue(unit);
      jest
        .spyOn(service as any, 'getUnitDetails')
        .mockResolvedValue(unitDetails);

      const result = await service.updateUnit('locId', 1, payload, 'userId');

      // Check if the getUnitDetails method was called
      expect(service['getUnitDetails']).toHaveBeenCalledWith(1);

      // Check if the result is the first element of the mocked UnitDTO array
      expect(result).toBe(unitDetails[0]);
    });
  });
});
