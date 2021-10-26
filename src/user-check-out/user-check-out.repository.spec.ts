import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UserCheckOutRepository } from './user-check-out.repository';

describe('UserCheckOutRepository', () => {
  let repository: UserCheckOutRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
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
