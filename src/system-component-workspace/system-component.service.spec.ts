import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentWorkspaceService } from './system-component.service';
import { SystemComponentWorkspaceRepository } from './system-component.repository';

const mockRepository = () => ({
  getComponents: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('SystemComponentWorkspaceService', () => {
  let service: SystemComponentWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        SystemComponentWorkspaceService,
        {
          provide: SystemComponentWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: SystemComponentMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(SystemComponentWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComponents', () => {
    it('should return array of system components', async () => {
      const result = await service.getComponents(null, null);
      expect(result).toEqual('');
    });
  });
});
