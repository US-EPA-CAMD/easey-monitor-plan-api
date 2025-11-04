import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { UnitProgramRepository } from './unit-program.repository';
import { UnitProgram } from '../entities/workspace/unit-program.entity';
import { DataSource } from 'typeorm';
import { useSlaveQueryRunner } from '../utilities/use-slave-query';

const unitProgramEntity = new UnitProgram(); // Mocked UnitProgram entity
jest.mock('../utilities/use-slave-query');

// Mocking the SelectQueryBuilder and its methods
const mockQueryBuilder =  {
  where: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([unitProgramEntity]),
  getOne: jest.fn().mockResolvedValue(unitProgramEntity),
};

const mockManager = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
 };

describe('UnitProgramRepository', () => {
  let repository: UnitProgramRepository;
  let queryBuilder: SelectQueryBuilder<UnitProgram>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        UnitProgramRepository,
        { provide: SelectQueryBuilder, useFactory: (): Partial<SelectQueryBuilder<UnitProgram>> => mockQueryBuilder },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    // Get the repository and query builder from the module
    repository = module.get(UnitProgramRepository);
    queryBuilder = module.get<SelectQueryBuilder<UnitProgram>>(
      SelectQueryBuilder,
    );

    // Mocking the createQueryBuilder to return the queryBuilder mock
    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    (useSlaveQueryRunner as jest.Mock).mockImplementation(
              async (_dataSource, callback) =>
          callback(mockManager)) 
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getUnitPrograms', () => {
    it('calls createQueryBuilder and returns an array of unit programs', async () => {
      // Cast to jest.Mock to avoid TypeScript errors
      (queryBuilder.where as jest.Mock).mockReturnValue(queryBuilder);
      (queryBuilder.getMany as jest.Mock).mockReturnValue([unitProgramEntity]);

      const result = await repository.getUnitProgramsByUnitRecordId(1);
      expect(result).toEqual([unitProgramEntity]);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'up.unitId = :unitRecordId',
        {
          unitRecordId: 1,
        },
      );
    });
  });

  describe('getUnitProgram', () => {
    it('calls createQueryBuilder and returns a single unit program', async () => {
      // Cast to jest.Mock to avoid TypeScript errors
      (queryBuilder.where as jest.Mock).mockReturnValue(queryBuilder);
      (queryBuilder.getOne as jest.Mock).mockReturnValue(unitProgramEntity);

      const result = await repository.getUnitProgramByProgramId('unitProgId');
      expect(result).toEqual(unitProgramEntity);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'up.programId = :progId',
        {
          progId: 'unitProgId',
        },
      );
    });
  });
});
