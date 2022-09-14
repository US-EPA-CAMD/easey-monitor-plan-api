import { Test } from '@nestjs/testing';
import { Component } from '../entities/workspace/component.entity';
import { SelectQueryBuilder } from 'typeorm';
import { ComponentWorkspaceRepository } from './component.repository';

const monMethod = new Component();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  getOne: jest.fn(),
});

describe('ComponentWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ComponentWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(ComponentWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<Component>>(
      SelectQueryBuilder,
    );
  });

  describe('getComponent', () => {
    it('calls createQueryBuilder and get a component', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(monMethod);

      const result = await repository.getComponent('uuid');

      expect(result).toEqual(monMethod);
    });
  });

  describe('getComponentByLocIdAndCompId', () => {
    it('calls createQueryBuilder and get a component', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(monMethod);

      const result = await repository.getComponentByLocIdAndCompId(
        'locationId',
        'componentIdentifier',
      );

      expect(result).toEqual(monMethod);
    });
  });
});
