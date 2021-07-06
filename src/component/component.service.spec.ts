import { Test, TestingModule } from '@nestjs/testing';

import { ComponentMap } from '../maps/component.map';
import { ComponentService } from './component.service';
import { ComponentRepository } from './component.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('ComponentService', () => {
  let service: ComponentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentService,
        {
          provide: ComponentRepository,
          useFactory: mockRepository,
        },
        {
          provide: ComponentMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(ComponentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComponents', () => {
    it('should return array of components', async () => {
      const result = await service.getComponents(null);
      expect(result).toEqual('');
    });
  });
});
