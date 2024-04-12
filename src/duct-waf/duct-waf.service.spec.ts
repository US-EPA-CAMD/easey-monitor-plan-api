import { Test, TestingModule } from '@nestjs/testing';

import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafService } from './duct-waf.service';
import { DuctWafRepository } from './duct-waf.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('DuctWafService', () => {
  let service: DuctWafService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        DuctWafService,
        {
          provide: DuctWafRepository,
          useFactory: mockRepository,
        },
        {
          provide: DuctWafMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<DuctWafService>(DuctWafService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDuctWafs', () => {
    it('should return array of duct wafs', async () => {
      const result = await service.getDuctWafs(null);
      expect(result).toEqual('');
    });
  });
});
