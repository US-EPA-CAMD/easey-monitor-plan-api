import { Test } from '@nestjs/testing';

import { MatsMethodMap } from '../maps/mats-method-data.map';
import { MatsMethodRepository } from './supplemental-methods.repository';
import { SupplementalMethodsService } from './supplemental-methods.service';

const mockMatsMethodRepository = () => ({
  find: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('-- Supplemental Methods Service --', () => {
  let supplementalMethodsService;
  let matsMethodRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SupplementalMethodsService,
        {
          provide: MatsMethodRepository,
          useFactory: mockMatsMethodRepository,
        },
        { provide: MatsMethodMap, useFactory: mockMap },
      ],
    }).compile();

    supplementalMethodsService = module.get(SupplementalMethodsService);
    matsMethodRepository = module.get(MatsMethodRepository);

    map = module.get(MatsMethodMap);
  });

  describe('* getMatsMethods', () => {
    it('should return all the supplemental methods with the specified monLocId', async () => {
      map.many.mockReturnValue('mockSupplementalMethods');

      const monLocId = '123';

      let result = await supplementalMethodsService.getMatsMethods(monLocId);

      expect(matsMethodRepository.find).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mockSupplementalMethods');
    });
  });
});
