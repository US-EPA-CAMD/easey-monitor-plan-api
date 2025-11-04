import { Test, TestingModule } from '@nestjs/testing';

import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafService } from './duct-waf.service';
import { DuctWafRepository } from './duct-waf.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '../utilities/use-slave-repository';

jest.mock('../utilities/use-slave-repository');

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('DuctWafService', () => {
  let service: DuctWafService;
  let dataSource: DataSource;

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
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<DuctWafService>(DuctWafService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDuctWafs', () => {
    it('should return array of duct wafs', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
        );
      const result = await service.getDuctWafs(null);
      expect(result).toEqual('');
    });
  });
});
