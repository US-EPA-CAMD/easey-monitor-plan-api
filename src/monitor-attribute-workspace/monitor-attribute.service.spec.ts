import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { HttpModule } from '@nestjs/axios';

import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const returnedMonitorAttribute = new MonitorAttributeDTO();
const returnedMonitorAttributes: MonitorAttributeDTO[] = [];
returnedMonitorAttributes.push(returnedMonitorAttribute);

const mockMonitorAttributeWorkspaceRepository = () => ({
  getAttribute: jest.fn().mockResolvedValue(returnedMonitorAttribute),
  find: jest.fn().mockResolvedValue([returnedMonitorAttribute]),
});

const mockMonitorAttributeMap = () => ({
  one: jest.fn().mockResolvedValue(returnedMonitorAttribute),
  many: jest.fn().mockResolvedValue(returnedMonitorAttributes),
});

describe('MonitorAttributeWorkspaceService', () => {
  let service: MonitorAttributeWorkspaceService;
  let repository: MonitorAttributeWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        MonitorAttributeWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorAttributeWorkspaceRepository,
          useFactory: mockMonitorAttributeWorkspaceRepository,
        },
        {
          provide: MonitorAttributeMap,
          useFactory: mockMonitorAttributeMap,
        },
      ],
    }).compile();

    service = module.get<MonitorAttributeWorkspaceService>(
      MonitorAttributeWorkspaceService,
    );
    repository = module.get<MonitorAttributeWorkspaceRepository>(
      MonitorAttributeWorkspaceRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAttributes', () => {
    it('should return array of location attributes', async () => {
      const result = await service.getAttributes(null);
      expect(result).toEqual(returnedMonitorAttributes);
    });
  });
});
