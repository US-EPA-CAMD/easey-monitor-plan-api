import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { HttpStatus } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import { MonitorSystemCheckService } from './monitor-system-checks.service';
import { UpdateMonitorSystemDTO } from '../dtos/monitor-system.dto';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const mockMonitorSystemWorkspaceRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(null),
});

const mockComponentCheckService = () => ({
  runChecks: jest.fn().mockResolvedValue([]),
});

describe('Monitor System Check Service Tests', () => {
  let service: MonitorSystemCheckService;
  let componentCheckService: ComponentCheckService;
  let monitorSystemRepository: MonitorSystemWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorSystemCheckService,
        {
          provide: ComponentCheckService,
          useFactory: mockComponentCheckService,
        },
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: mockMonitorSystemWorkspaceRepository,
        },
      ],
    }).compile();

    service = module.get(MonitorSystemCheckService);
    componentCheckService = module.get(ComponentCheckService);
    monitorSystemRepository = module.get(MonitorSystemWorkspaceRepository);
  });

  describe('runChecks - SYSTEM-24-A', () => {
    it('should throw SYSTEM-24-A', async () => {

      const locationId = 'test-location-id';
      const payload: UpdateMonitorSystemDTO = {
        monitoringSystemId: 'S01',
        systemTypeCode: 'FLOW',
        beginDate: new Date('2023-01-01'),
        beginHour: 0,
        endDate: new Date('2023-12-31'),
        endHour: 23,
        systemDesignationCode: 'P',
        fuelCode: 'GAS',
        monitoringSystemComponentData: [],
        monitoringSystemFuelFlowData: []
      };

      const duplicateSystem = {
        id: 'existing-system-id',
        monitoringSystemId: 'S01',
        locationId: 'test-location-id'
      };
      
      jest.spyOn(monitorSystemRepository, 'findOneBy').mockResolvedValue(duplicateSystem as any);

      (CheckCatalogService.formatResultMessage as jest.Mock).mockReturnValue(
        '[SYSTEM-24-A] Duplicate System record found with Monitoring System ID S01.'
      );

      await expect(
        service.runChecks(locationId, payload, false, false, '')
      ).rejects.toThrow(EaseyException);

      try {
        await service.runChecks(locationId, payload, false, false, '');
      } catch (error) {
        expect(error.response.message).toContain('SYSTEM-24-A');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should not throw SYSTEM-24-A', async () => {
      const locationId = 'test-location-id';
      const payload: UpdateMonitorSystemDTO = {
        monitoringSystemId: 'S01',
        systemTypeCode: 'FLOW',
        beginDate: new Date('2023-01-01'),
        beginHour: 0,
        endDate: new Date('2023-12-31'),
        endHour: 23,
        systemDesignationCode: 'P',
        fuelCode: 'GAS',
        monitoringSystemComponentData: [],
        monitoringSystemFuelFlowData: []
      };

      jest.spyOn(monitorSystemRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.runChecks(locationId, payload, false, false, '')
      ).resolves.not.toThrow();
    });

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(componentCheckService).toBeDefined();
    expect(monitorSystemRepository).toBeDefined();
  });
});