import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodController } from './monitor-method.controller';
import { MonitorMethodRepository } from './monitor-method.repository';
import { MonitorMethodService } from './monitor-method.service';
import { MonitorMethodDTO } from '../dtos/monitor-method.dto';

const mockConfigService = () => ({
  get: jest.fn(),
});

describe('-- Monitor Method Controller --', () => {
  let monitorMethodController: MonitorMethodController;
  let monitorMethodService: MonitorMethodService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [MonitorMethodController],
      providers: [
        MonitorMethodMap,
        MonitorMethodService,
        MonitorMethodRepository,
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
      ],
    }).compile();

    monitorMethodController = module.get(MonitorMethodController);
    monitorMethodService = module.get(MonitorMethodService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getMonitorMethods', () => {
    it('should return a list of Monitor Methods', async () => {
      const monLocId = '123';
      const expectedResult: MonitorMethodDTO[] = [];

      const serviceSpy = jest
        .spyOn(monitorMethodService, 'getMonitorMethods')
        .mockResolvedValue(expectedResult);

      const result = await monitorMethodController.getUnits(monLocId);

      expect(serviceSpy).toHaveBeenCalledWith(monLocId);
      expect(result).toBe(expectedResult);
    });
  });
  describe('* getMethods', () => {
    it('should return a list of Monitor Methods', async () => {
      const monLocId = '123';
      const expectedResult: MonitorMethodDTO[] = [];

      const serviceSpy = jest
        .spyOn(monitorMethodService, 'getMonitorMethods')
        .mockResolvedValue(expectedResult);

      const result = await monitorMethodController.getUnits(monLocId);

      expect(serviceSpy).toHaveBeenCalledWith(monLocId);
      expect(result).toBe(expectedResult);
    });
  });
});
