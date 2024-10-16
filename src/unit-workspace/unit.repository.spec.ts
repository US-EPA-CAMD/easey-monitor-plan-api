import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { UnitWorkspaceRepository } from './unit.repository';
import { Unit } from '../entities/workspace/unit.entity';

const unitEntity = new Unit(); // Mocked Unit entity

// Mocking the SelectQueryBuilder and its methods
const mockQueryBuilder = (): Partial<SelectQueryBuilder<Unit>> => ({
  where: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([unitEntity]),
  getOne: jest.fn().mockResolvedValue(unitEntity),
});

describe('UnitWorkspaceRepository', () => {
  let repository: UnitWorkspaceRepository;
  let queryBuilder: SelectQueryBuilder<Unit>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        UnitWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    // Get the repository and query builder from the module
    repository = module.get(UnitWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<Unit>>(SelectQueryBuilder);

    // Mocking the createQueryBuilder to return the queryBuilder mock
    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
