import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { SystemComponent } from '../entities/workspace/system-component.entity';
import { SystemComponentWorkspaceRepository } from './system-component.repository';

const sysComp = new SystemComponent();

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
  orderBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('SystemComponentWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        SystemComponentWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(SystemComponentWorkspaceRepository);
    queryBuilder = module.get<
      SelectQueryBuilder<SystemComponentWorkspaceRepository>
    >(SelectQueryBuilder);
  });

  describe('getSystemComponent', () => {
    it('calls createQueryBuilder and gets a System Component from the repository with the specified monSysId and monSysCompId', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(sysComp);

      const result = await repository.getSystemComponent('1', '1');

      expect(result).toEqual(sysComp);
    });
  });

  describe('getSystemComponents', () => {
    it('calls createQueryBuilder and gets all System Components from the repository with the specified locationId and monSysId', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([sysComp]);

      const result = await repository.getSystemComponents('1', '1');

      expect(result).toEqual([sysComp]);
    });
  });

  describe('getSystemComponentsBySystemIds', () => {
    it('calls createQueryBuilder and gets all System Components from the repository with the specified monSysIds', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([sysComp]);

      const result = await repository.getSystemComponentsBySystemIds(['1']);

      expect(result).toEqual([sysComp]);
    });
  });

  describe('getSystemComponentByBeginOrEndDate', () => {
    it('calls createQueryBuilder and gets a System Component from the repository with the specified monSysId, componentId, beginDate and beginTime', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(sysComp);

      const result = await repository.getSystemComponentByBeginOrEndDate(
        '1',
        '1',
        new Date(),
        1,
      );

      expect(result).toEqual(sysComp);
    });
  });
});
