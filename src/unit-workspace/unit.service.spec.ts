import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { Unit } from '../entities/workspace/unit.entity';
import { UnitParamsDTO } from '../dtos/unit.params.dto';
import { UnitWorkspaceRepository } from './unit.repository';
import { UnitMap } from '../maps/unit.map';
import { UnitWorkspaceService } from './unit.service';

const mockRequest = (url?: string, page?: number, perPage?: number) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
    query: {
      page,
      perPage,
    },
    headers: {
      accept: 'application/json',
    },
    on: jest.fn(),
  };
};

const mockRepository = () => ({
  findAndCount: jest.fn().mockResolvedValue([[], 0]),
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
    let totalCount = unitList.length;

    async function testGetPage(page: number, perPage: number) {
      const end = page * perPage;
      const start = page * perPage - perPage + 1;
      const req: any = mockRequest(
        `/workspace/units?page=${page}&perPage=${perPage}`,
      );
      req.res.setHeader.mockReturnValue();
      const paramsDto: UnitParamsDTO = {
        page: page,
        perPage: perPage,
        facilityId: undefined,
      };
      const units = unitList.slice(start, end);
      const unitsDto = await map.many(units);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([units, totalCount]);
      const results = await service.getUnits(paramsDto, req);
      expect(results).toStrictEqual(unitsDto);
    }

    it('should return array with all facilities', async () => {
      const paramsDto: UnitParamsDTO = new UnitParamsDTO();
      const units = await map.many(unitList);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([unitList, totalCount]);
      const results = await service.getUnits(paramsDto, undefined);
      expect(results).toStrictEqual(units);
    });

    it('should return 1-4 of 16 units', async () => {
      await testGetPage(1, 4);
    });

    it('should return 5-8 of 16 units', async () => {
      await testGetPage(2, 4);
    });

    it('should return 9-12 of 16 units', async () => {
      await testGetPage(3, 4);
    });

    it('should return 13-16 of 16 units', async () => {
      await testGetPage(4, 4);
    });

    it('should return array with 4 units with a facility ID of 2', async () => {
      const paramsDto: UnitParamsDTO = {
        page: undefined,
        perPage: undefined,
        facilityId: 2,
      };
      const units = unitList.filter(u => (u.facId = paramsDto.facilityId));
      totalCount = units.length;
      const unitsDto = await map.many(units);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([units, totalCount]);

      const results = await service.getUnits(paramsDto, undefined);
      expect(results).toStrictEqual(unitsDto);
    });
  });
});
