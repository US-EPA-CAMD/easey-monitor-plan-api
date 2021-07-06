import { Test, TestingModule } from '@nestjs/testing';

import { UserCheckOutMap } from '../maps/user-check-out.map';
import { UserCheckOutService } from './user-check-out.service';
import { UserCheckOutRepository } from './user-check-out.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
  findOne: jest.fn().mockResolvedValue(''),
  save: jest.fn().mockResolvedValue(''),
  delete: jest.fn().mockResolvedValue(''),
  checkOutConfiguration: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('UserCheckOutService', () => {
  let service: UserCheckOutService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCheckOutService,
        {
          provide: UserCheckOutRepository,
          useFactory: mockRepository,
        },
        {
          provide: UserCheckOutMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(UserCheckOutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('getCheckedOutConfiguration', () => {
  //   it('should return a single checked out configuration', async () => {
  //     const result = await service.getCheckedOutConfiguration(null);
  //     expect(result).toEqual('');
  //   });
  // });

  describe('getCheckedOutConfigurations', () => {
    it('should return array of checked out configurations', async () => {
      const result = await service.getCheckedOutConfigurations();
      expect(result).toEqual('');
    });
  });

  describe('checkOutConfiguration', () => {
    it('should check out a configuration and return it', async () => {
      const result = await service.checkOutConfiguration(null, null);
      expect(result).toEqual('');
    });
  });

  // describe('updateLastActivity', () => {
  //   it('should update last activity for a checked out configuration', async () => {
  //     const result = await service.updateLastActivity(null);
  //     expect(result).toEqual('');
  //   });
  // });
});
