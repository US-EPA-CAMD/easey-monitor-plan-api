import { Test } from '@nestjs/testing';

import { UserCheckOutRepository } from './user-check-out.repository';

describe('UserCheckOutRepository', () => {
  let repository: UserCheckOutRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserCheckOutRepository],
    }).compile();

    repository = module.get(UserCheckOutRepository);
  });

  describe('checkOutConfiguration', () => {
    it('should return checked out record', async () => {
      repository.query = jest.fn().mockReturnValue('');
      repository.findOne = jest.fn().mockReturnValue('');
      const result = await repository.checkOutConfiguration(null, null);
      expect(result).toEqual('');
    });
  });
});
