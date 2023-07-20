import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { CPMSQualificationRepository } from './cpms-qualification.repository';
import { CPMSQualification } from '../entities/cpms-qualification.entity';

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

describe('CPMSQualificationRepository', () => {
  let cpmsQualificationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CPMSQualificationRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    cpmsQualificationRepository = module.get(CPMSQualificationRepository);
    queryBuilder = module.get<SelectQueryBuilder<CPMSQualification>>(
      SelectQueryBuilder,
    );
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
