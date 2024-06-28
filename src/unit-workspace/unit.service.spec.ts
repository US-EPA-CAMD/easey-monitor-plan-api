import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { Unit } from '../entities/workspace/unit.entity';
import { UnitMap } from '../maps/unit.map';
import { UnitWorkspaceRepository } from './unit.repository';
import { UnitWorkspaceService } from './unit.service';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
  findOneBy: jest.fn().mockResolvedValue(''),
  update: jest.fn().mockResolvedValue(true),
});

const mockUnit = (id: number, name: string, facId: number) => {
  const unit = new Unit();
  unit.id = id;
  unit.name = name;
  unit.facId = facId;
  return unit;
};

describe('Unit Workspace Tests', () => {
  const map = new UnitMap();
  let service: UnitWorkspaceService;
  let repository: UnitWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitMap,
        {
          provide: UnitWorkspaceRepository,
          useFactory: mockRepository,
        },
        UnitWorkspaceService,
      ],
    }).compile();

    repository = module.get(UnitWorkspaceRepository);
    service = module.get(UnitWorkspaceService);
  });

  describe('getUnits', () => {
    const unitList: Unit[] = new Array(16)
      .fill(null)
      .map((_, i) => mockUnit(i + 1, `Test Unit ${i + 1}`, (i + 1) % 4));
    it('should return array with all units for a facility', async () => {
      const units = unitList.filter(u => u.facId === 2);
      const unitsDto = await map.many(units);
      jest.spyOn(repository, 'findBy').mockResolvedValue(units);
      const results = await service.getUnitsByFacId(2);
      expect(results).toStrictEqual(unitsDto);
    });
  });
});
