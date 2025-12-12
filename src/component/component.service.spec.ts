import { Test, TestingModule } from '@nestjs/testing';

import { ComponentMap } from '../maps/component.map';
import { ComponentService } from './component.service';
import { ComponentRepository } from './component.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { Component } from '../entities/workspace/component.entity';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UpdateComponentBaseDTO } from '../dtos/component.dto';
import { ArrayMaxSize } from 'class-validator';
import { AnalyzerRangeBaseDTO } from '../dtos/analyzer-range.dto';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
  findOne: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('ComponentService', () => {
  let service: ComponentService;
  let repository: ComponentRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = {} as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
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
       { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(ComponentService);
    repository = module.get(ComponentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComponents', () => {
    it('should return array of components', async () => {
     (useSlaveRepository as jest.Mock).mockImplementation(
       async (_dataSource, _repo, callback) =>
         callback(mockRepository()) 
     );
      const result = await service.getComponents(null);
      expect(result).toEqual('');
    });
  });
});
