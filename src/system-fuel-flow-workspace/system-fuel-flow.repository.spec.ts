import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { SystemFuelFlow } from '../entities/workspace/system-fuel-flow.entity';
import { SystemFuelFlowBaseDTO } from '../dtos/system-fuel-flow.dto';

const sysFuelFlow = new SystemFuelFlow();

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('SystemFuelFlowWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SystemFuelFlowWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(SystemFuelFlowWorkspaceRepository);
    queryBuilder = module.get<
      SelectQueryBuilder<SystemFuelFlowWorkspaceRepository>
    >(SelectQueryBuilder);
  });

  describe('getFuelFlow', () => {
    it('calls createQueryBuilder and gets a System Fuel Flow from the repository with the specified Id', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(sysFuelFlow);

      const result = await repository.getFuelFlow('1');

      expect(result).toEqual(sysFuelFlow);
    });
  });

  describe('getFuelFlows', () => {
    it('calls createQueryBuilder and gets all System Fuel Flows from the repository with the specified monSysId', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([sysFuelFlow]);

      const result = await repository.getFuelFlows('1');

      expect(result).toEqual([sysFuelFlow]);
    });
  });

  describe('getFuelFlowsBySystemIds', () => {
    it('calls createQueryBuilder and gets all System Fuel Flows from the repository with the specified monSysIds', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([sysFuelFlow]);

      const result = await repository.getFuelFlowsBySystemIds(['1']);

      expect(result).toEqual([sysFuelFlow]);
    });
  });

  describe('getFuelFlowByBeginOrEndDate', () => {
    it('calls createQueryBuilder and gets a System Fuel Flow from the repository with the specified monSysId, beginDate, beginHour, endDate and endHour', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(sysFuelFlow);

      const sysFFDto = new SystemFuelFlowBaseDTO();
      sysFFDto.beginDate = new Date();
      sysFFDto.beginHour = 1;
      sysFFDto.endDate = new Date();
      sysFFDto.endHour = 1;

      const result = await repository.getFuelFlowByBeginOrEndDate(
        '1',
        sysFFDto,
      );

      expect(result).toEqual(sysFuelFlow);
    });
  });
});
