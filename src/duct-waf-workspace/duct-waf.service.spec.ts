import { Test, TestingModule } from '@nestjs/testing';

import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafWorkspaceService } from './duct-waf.service';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('DuctWafWorkspaceService', () => {
  let service: DuctWafWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        DuctWafWorkspaceService,
        {
          provide: DuctWafWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: DuctWafMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<DuctWafWorkspaceService>(DuctWafWorkspaceService);
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
