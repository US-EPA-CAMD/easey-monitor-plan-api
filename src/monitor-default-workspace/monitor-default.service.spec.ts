import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';
import { MonitorDefault } from '../entities/workspace/monitor-default.entity';
import {
  MonitorDefaultBaseDTO,
  MonitorDefaultDTO,
} from '../dtos/monitor-default.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const monDefault = new MonitorDefault();
const monDefaultDto = new MonitorDefaultDTO();

const payload = new MonitorDefaultBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([monDefault]),
  create: jest.fn().mockResolvedValue(monDefault),
  save: jest.fn().mockResolvedValue(monDefault),
  getDefault: jest.fn().mockResolvedValue(monDefault),
  getDefaultBySpecs: jest.fn().mockResolvedValue(monDefault),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(monDefaultDto),
  many: jest.fn().mockResolvedValue([monDefaultDto]),
});

describe('MonitorDefaultWorkspaceService', () => {
  let service: MonitorDefaultWorkspaceService;
  let repository: MonitorDefaultWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        MonitorDefaultWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorDefaultWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorDefaultMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorDefaultWorkspaceService>(
      MonitorDefaultWorkspaceService,
    );
    repository = module.get<MonitorDefaultWorkspaceRepository>(
      MonitorDefaultWorkspaceRepository,
    );
  });

  describe('getDefaults', () => {
    it('should return array of location defaults', async () => {
      const result = await service.getDefaults('1');
      expect(result).toEqual([monDefaultDto]);
    });
  });

  describe('getDefault', () => {
    it('should return a location defaults', async () => {
      const result = await service.getDefault('1', '1');
      expect(result).toEqual(monDefault);
    });

    it('should throw error when monitor defaults not found', async () => {
      jest.spyOn(repository, 'getDefault').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getDefault('1', '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createDefault', () => {
    it('should create and return monitor default', async () => {
      const result = await service.createDefault('1', payload, 'testUser');
      expect(result).toEqual(monDefaultDto);
    });
  });

  describe('updateDefault', () => {
    it('should update and return monitor default when monitor default found', async () => {
      jest.spyOn(service, 'getDefault').mockResolvedValue(monDefault);

      const result = await service.updateDefault('1', '1', payload, 'testUser');
      expect(result).toEqual(monDefaultDto);
    });
  });

  describe('importDefault', () => {
    it('should update while importing monitor default', async () => {
      const result = await service.importDefault('1', [payload], 'testUser');
      expect(result).toEqual(true);
    });
    it('should create while importing monitor default', async () => {
      jest.spyOn(repository, 'getDefaultBySpecs').mockResolvedValue(undefined);

      const result = await service.importDefault('1', [payload], 'testUser');
      expect(result).toEqual(true);
    });
  });
});
