import { Test, TestingModule } from '@nestjs/testing';

import { MatsMethodWorkspaceService } from './mats-method.service';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethod } from '../entities/workspace/mats-method.entity';
import { MatsMethodMap } from '../maps/mats-method.map';
import { CreateMatsMethodDTO } from '../dtos/create-mats-method.dto';
import { UpdateMatsMethodDTO } from '../dtos/update-mats-method.dto';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new MatsMethod()),
  create: jest.fn().mockResolvedValue(new MatsMethod()),
  save: jest.fn().mockResolvedValue(new MatsMethod()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

const monLocId = '5770';
const methodId = 'someId';

const createMatsMethodDTO: CreateMatsMethodDTO = {
  matsMethodCode: 'string',
  matsMethodParameterCode: 'string',
  beginDate: new Date(Date.now()),
  beginHour: 1,
  endDate: new Date(Date.now()),
  endHour: 1,
};

const updateMatsMethodDTO: UpdateMatsMethodDTO = {
  beginDate: new Date(Date.now()),
  beginHour: 1,
  endDate: new Date(Date.now()),
  endHour: 1,
};

describe('MonitorMethodWorkspaceService', () => {
  let service: MatsMethodWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatsMethodWorkspaceService,
        {
          provide: MatsMethodWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MatsMethodMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MatsMethodWorkspaceService);
  });

  describe('getMethods', () => {
    it('calls the MatsMehtodWorkspaceRepository.find() gets all mats method codes for monLocId', async () => {
      const result = await service.getMethods(monLocId);
      expect(result).toEqual([]);
    });
  });

  describe('getMethod', () => {
    it('should return an array of mats methods', async () => {
      const result = await service.getMethod(methodId);
      expect(result).toEqual({});
    });
  });

  describe('createMethod', () => {
    it('creates a matsMethodCode data for a specified monLocId', async () => {
      const result = await service.createMethod(monLocId, createMatsMethodDTO);
      expect(result).toEqual({});
    });
  });

  describe('updateMetod', () => {
    it('updates a matsMethodCode data for a specified monLocId', async () => {
      const result = await service.updateMethod(
        methodId,
        monLocId,
        updateMatsMethodDTO,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
