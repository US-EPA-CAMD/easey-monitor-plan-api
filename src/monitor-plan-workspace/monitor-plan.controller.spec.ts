import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { MonitorPlanWorkspaceController } from './monitor-plan.controller';
import { MPEvaluationReportDTO } from '../dtos/mp-evaluation-report.dto';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
// import { UserCheckOutService } from './../user-check-out/user-check-out.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ImportChecksService } from '../import-checks/import-checks.service';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';

jest.mock('./monitor-plan.service');
jest.mock('../user-check-out/user-check-out.service');
jest.mock('../import-checks/import-checks.service');

const orisCode = null;
const planId = null;

const data: MonitorPlanDTO[] = [];
data.push(new MonitorPlanDTO());
data.push(new MonitorPlanDTO());

const evaluationRportData = [];
evaluationRportData.push(new MPEvaluationReportDTO());
evaluationRportData.push(new MPEvaluationReportDTO());

const ucoData: UserCheckOutDTO[] = [];
ucoData.push(new UserCheckOutDTO());
ucoData.push(new UserCheckOutDTO());

describe('MonitorPlanWorkspaceController', () => {
  let controller: MonitorPlanWorkspaceController;
  let service: MonitorPlanWorkspaceService;
  let importService: ImportChecksService;
  // let ucoService: UserCheckOutService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorPlanWorkspaceController],
      providers: [
        MonitorPlanWorkspaceService,
        ImportChecksService,
        AuthGuard,
        ConfigService,
      ],
    }).compile();

    controller = module.get(MonitorPlanWorkspaceController);
    service = module.get(MonitorPlanWorkspaceService);
    importService = module.get(ImportChecksService);
    // ucoService = module.get(UserCheckOutService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('exportMonitorPlan', () => {
    it('should export a monitor plan given a plan id', async () => {
      jest.spyOn(service, 'exportMonitorPlan').mockResolvedValue(null);
      expect(await controller.exportMonitorPlan(planId)).toBe(null);
    });
  });

  describe('getConfigurations', () => {
    it('should return array of monitor plan configurations', async () => {
      jest.spyOn(service, 'getConfigurationsByOris').mockResolvedValue(data);
      expect(await controller.getConfigurations(orisCode)).toBe(data);
    });
  });

  describe('getMonitorPlan', () => {
    it('should return a monitor plan given a planId', async () => {
      jest.spyOn(service, 'getMonitorPlan').mockResolvedValue(data[0]);
      expect(await controller.getMonitorPlan(planId)).toBe(data[0]);
    });
  });

  describe('getEvaluationReport', () => {
    it('should return an evaluation report given a planId', async () => {
      jest
        .spyOn(service, 'getEvaluationReport')
        .mockResolvedValue(evaluationRportData[0]);
      expect(await controller.getEvaluationReport(planId)).toBe(
        evaluationRportData[0],
      );
    });
  });

  describe('importPlan', () => {
    it('should return import a report plan given a planId', async () => {
      jest.spyOn(service, 'importMpPlan').mockResolvedValue(data[0]);
      expect(await controller.importPlan(planId)).toBe(data[0]);
    });
  });

  describe('revertToOfficialRecord', () => {
    it('should revert to official record given a planId', async () => {
      jest.spyOn(service, 'revertToOfficialRecord').mockResolvedValue(null);
      expect(await controller.revertToOfficialRecord(planId)).toBe(null);
    });
  });

  // describe('getCheckedOutConfigurations', () => {
  //   it('should return array of monitor plan configurations checked out', async () => {
  //     jest
  //       .spyOn(ucoService, 'getCheckedOutConfigurations')
  //       .mockResolvedValue(ucoData);
  //     expect(await controller.getCheckedOutConfigurations()).toBe(ucoData);
  //   });
  // });
});
