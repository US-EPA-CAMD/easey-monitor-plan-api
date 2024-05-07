import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { UserCheckOutMap } from '../maps/user-check-out.map';
import { UserCheckOutService } from './user-check-out.service';
import { UserCheckOutRepository } from './user-check-out.repository';
import { UserCheckOut } from '../entities/workspace/user-check-out.entity';
import { UserCheckOutDTO } from '../dtos/user-check-out.dto';

const monPlanId = '1';
const userCheckout = new UserCheckOut();
const userCheckoutDto = new UserCheckOutDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([userCheckout]),
  findOneBy: jest.fn().mockResolvedValue(userCheckout),
  save: jest.fn().mockResolvedValue(userCheckout),
  delete: jest.fn().mockResolvedValue(userCheckout),
  checkOutConfiguration: jest.fn().mockResolvedValue(userCheckout),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(userCheckoutDto),
  many: jest.fn().mockResolvedValue([userCheckoutDto]),
});

describe('UserCheckOutService', () => {
  let service: UserCheckOutService;
  let repository: UserCheckOutRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UserCheckOutService,
        EntityManager,
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
    repository = module.get(UserCheckOutRepository);
  });

  describe('getCheckedOutConfigurations', () => {
    it('should return array of checked out configurations', async () => {
      const result = await service.getCheckedOutConfigurations();
      expect(result).toEqual([userCheckoutDto]);
    });
  });

  describe('checkOutConfiguration', () => {
    it('should check out a configuration and return it', async () => {
      const result = await service.checkOutConfiguration(null, null);
      expect(result).toEqual(userCheckoutDto);
    });
  });

  describe('getCheckedOutConfiguration', () => {
    it('should return a checked out configuration', async () => {
      const result = await service.getCheckedOutConfiguration(monPlanId);
      expect(result).toEqual(userCheckoutDto);
    });

    it('should throw error when a checked out configuration not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockReturnValue(null);
      let errored = false;
      try {
        await service.getCheckedOutConfiguration(monPlanId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('updateLastActivity', () => {
    it('should update a configuration and return it', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(userCheckout);
      userCheckoutDto.lastActivity = new Date(Date.now()).toISOString();
      jest.spyOn(repository, 'save').mockResolvedValue(userCheckout);

      const result = await service.updateLastActivity(monPlanId);
      expect(result).toEqual(userCheckoutDto);
    });
  });

  describe('checkInConfiguration', () => {
    it('should check in a configuration and return it', async () => {
      jest.spyOn(service, 'returnManager').mockReturnValue(({
        query: jest.fn().mockResolvedValue([]),
      } as any) as EntityManager);
      const result = await service.checkInConfiguration(monPlanId);
      expect(result).toEqual(true);
    });
  });
});
