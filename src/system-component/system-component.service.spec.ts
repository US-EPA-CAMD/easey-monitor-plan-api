import { Test, TestingModule } from '@nestjs/testing';

import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentService } from './system-component.service';
import { SystemComponentRepository } from './system-component.repository';

const mockRepository = () => ({
  getComponents: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('SystemComponentService', () => {
  let service: SystemComponentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemComponentService,
        {
          provide: SystemComponentRepository,
          useFactory: mockRepository,
        },
        {
          provide: SystemComponentMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(SystemComponentService);
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
