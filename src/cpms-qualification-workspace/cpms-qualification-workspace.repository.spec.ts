import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';
import { CPMSQualification } from '../entities/workspace/cpms-qualification.entity';

const entity = new CPMSQualification();

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('CPMSQualificationWorkspaceRepository', () => {
  let cpmsQualificationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CPMSQualificationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    cpmsQualificationRepository = module.get(
      CPMSQualificationWorkspaceRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<CPMSQualification>>(
      SelectQueryBuilder,
    );
  });

  describe('getCPMSQualification', () => {
    it('calls createQueryBuilder and gets all CPMSQualifications from the repository with the specified facId', async () => {
      cpmsQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(entity);

      const result = await cpmsQualificationRepository.getCPMSQualification(
        0,
        0,
        0,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(entity);
    });
  });

  describe('getCPMSQualificationByStackTestNumber', () => {
    it('calls createQueryBuilder and gets all CPMSQualifications from the repository with the specified qualification id and stack test number', async () => {
      cpmsQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(entity);

      const result = await cpmsQualificationRepository.getCPMSQualificationByStackTestNumber(
        'locId',
        'qualificationId',
        'Test1234',
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(entity);
    });
  });

  describe('getCPMSQualifications', () => {
    it('calls createQueryBuilder and gets all CPMSQualifications from the repository with the specified facId', async () => {
      cpmsQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([entity]);

      const result = await cpmsQualificationRepository.getCPMSQualifications(
        0,
        0,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([entity]);
    });
  });
});
