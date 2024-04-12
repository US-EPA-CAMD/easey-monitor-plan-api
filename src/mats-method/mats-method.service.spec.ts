import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodService } from './mats-method.service';
import { MatsMethodRepository } from './mats-method.repository';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MatsMethodService', () => {
  let service: MatsMethodService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MatsMethodService,
        {
          provide: MatsMethodRepository,
          useFactory: mockRepository,
        },
        {
          provide: MatsMethodMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MatsMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMethods', () => {
    it('should return array of mats methods', async () => {
      const result = await service.getMethods(null);
      expect(result).toEqual('');
    });
  });
});
