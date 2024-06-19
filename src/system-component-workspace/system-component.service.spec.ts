import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentWorkspaceService } from './system-component.service';
import { SystemComponentWorkspaceRepository } from './system-component.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import {
  SystemComponentBaseDTO,
  SystemComponentDTO,
} from '../dtos/system-component.dto';
import { ComponentDTO } from '../dtos/component.dto';
import { SystemComponent } from '../entities/workspace/system-component.entity';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { Component } from '../entities/workspace/component.entity';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const sysComp = new SystemComponentDTO();
const sysComps = [sysComp];

const payload = new SystemComponentBaseDTO();

const repositoryFactory = () => ({
  getSystemComponents: jest.fn().mockResolvedValue(sysComps),
  getSystemComponent: jest.fn().mockResolvedValue(sysComp),
  getSystemComponentByBeginOrEndDate: jest.fn().mockResolvedValue(sysComp),
  save: jest.fn().mockResolvedValue(sysComp),
  create: jest.fn().mockResolvedValue(sysComp),
});

const componentRepository = () => ({
  getComponentByLocIdAndCompId: jest.fn().mockResolvedValue(new Component()),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(sysComps),
  one: jest.fn().mockResolvedValue(sysComp),
});

const mockComponent = () => ({
  updateComponent: jest.fn().mockResolvedValue(new ComponentDTO()),
  getComponentByIdentifier: jest.fn().mockResolvedValue(new ComponentDTO()),
  createComponent: jest.fn().mockResolvedValue(new ComponentDTO()),
});

describe('SystemComponentWorkspaceService', () => {
  let service: SystemComponentWorkspaceService;
  let repository: SystemComponentWorkspaceRepository;
  let componentService: ComponentWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        SystemComponentWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: ComponentWorkspaceService,
          useFactory: mockComponent,
        },
        {
          provide: SystemComponentWorkspaceRepository,
          useFactory: repositoryFactory,
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: componentRepository,
        },
        {
          provide: SystemComponentMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    repository = module.get(SystemComponentWorkspaceRepository);
    service = module.get(SystemComponentWorkspaceService);
    componentService = module.get(ComponentWorkspaceService);
  });

  describe('getSystemComponents', () => {
    it('should return array of system components', async () => {
      const result = await service.getSystemComponents('1', '1');
      expect(result).toEqual(sysComps);
    });
  });

  describe('getSystemComponent', () => {
    it('should return a of system component', async () => {
      const result = await service.getSystemComponent('1', '1');
      expect(result).toEqual(sysComp);
    });

    it('should throw error when system component not found', async () => {
      jest.spyOn(repository, 'getSystemComponent').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getSystemComponent('1', '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('updateSystemComponent', () => {
    it('should update and return the system component', async () => {
      jest
        .spyOn(service, 'getSystemComponent')
        .mockResolvedValue(new SystemComponent());

      const result = await service.updateSystemComponent({
        locationId: '1',
        sysId: '1',
        sysComponentRecordId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(sysComp);
    });
  });

  describe('createSystemComponent', () => {
    it('should create and return system component when component found', async () => {
      const result = await service.createSystemComponent({
        locationId: '1',
        monitoringSystemRecordId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(sysComp);
    });
    it('should create a component and also create and return system component when component not found', async () => {
      jest
        .spyOn(componentService, 'getComponentByIdentifier')
        .mockResolvedValue(new ComponentDTO());

      const result = await service.createSystemComponent({
        locationId: '1',
        monitoringSystemRecordId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(sysComp);
    });
  });

  describe('importComponent', () => {
    it('should update system component while importing a system component and a system component record exists ', async () => {
      const result = await service.importSystemComponent(
        '1',
        '1',
        [payload],
        'testUser',
      );
      expect(result).toEqual(true);
    });

    it('should create system component while importing a system component and a system component record exists ', async () => {
      jest
        .spyOn(repository, 'getSystemComponentByBeginOrEndDate')
        .mockResolvedValue(null);

      jest
        .spyOn(componentService, 'getComponentByIdentifier')
        .mockResolvedValue(new ComponentDTO());

      const result = await service.importSystemComponent(
        '1',
        '1',
        [payload],
        'testUser',
      );
      expect(result).toEqual(true);
    });
  });
});
