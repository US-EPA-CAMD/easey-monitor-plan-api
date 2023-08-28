import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { MonitorPlanWorkspaceController } from './monitor-plan.controller';

import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ImportChecksService } from '../import-checks/import-checks.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { MonitorPlanChecksService } from './monitor-plan-checks.service';
import { MonitorPlanParamsDTO } from '../dtos/monitor-plan-params.dto';

jest.mock('./monitor-plan.service');
jest.mock('../user-check-out/user-check-out.service');
jest.mock('../import-checks/import-checks.service');

const orisCode = null;
const planId = null;
const params: MonitorPlanParamsDTO = new MonitorPlanParamsDTO();

const data: MonitorPlanDTO[] = [];
data.push(new MonitorPlanDTO());
data.push(new MonitorPlanDTO());

const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const mockCheckService = () => ({
  runChecks: jest.fn(),
});

describe('MonitorPlanWorkspaceController', () => {
  let controller: MonitorPlanWorkspaceController;
  let service: MonitorPlanWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorPlanWorkspaceController],
      providers: [
        MonitorPlanWorkspaceService,
        ImportChecksService,
        AuthGuard,
        ConfigService,
        {
          provide: MonitorPlanChecksService,
          useFactory: mockCheckService,
        },
      ],
    }).compile();

    controller = module.get(MonitorPlanWorkspaceController);
    service = module.get(MonitorPlanWorkspaceService);
  });

  describe('exportMonitorPlan', () => {
    it('should export a monitor plan given a plan id', async () => {
      jest.spyOn(service, 'exportMonitorPlan').mockResolvedValue(null);
      expect(await controller.exportMonitorPlan(planId, params)).toBe(null);
    });
  });

  describe('getMonitorPlan', () => {
    it('should return a monitor plan given a planId', async () => {
      jest.spyOn(service, 'getMonitorPlan').mockResolvedValue(data[0]);
      expect(await controller.getMonitorPlan(planId)).toBe(data[0]);
    });
  });

  describe('importPlan', () => {
    it('should import a report plan given a planId', async () => {
      jest.spyOn(service, 'importMpPlan').mockResolvedValue(data[0]);
      expect(await controller.importPlan(planId, currentUser)).toBe(data[0]);
    });
    it('should return success import message while imporing anew record', async () => {
      jest.spyOn(service, 'importMpPlan').mockResolvedValue(null);
      expect(await controller.importPlan(planId, currentUser)).toEqual({
        message: `Monitoring plan imported successfully`,
      });
    });
  });

  describe('revertToOfficialRecord', () => {
    it('should revert to official record given a planId', async () => {
      jest.spyOn(service, 'revertToOfficialRecord').mockResolvedValue(null);
      expect(await controller.revertToOfficialRecord(planId)).toBe(null);
    });
  });
});
