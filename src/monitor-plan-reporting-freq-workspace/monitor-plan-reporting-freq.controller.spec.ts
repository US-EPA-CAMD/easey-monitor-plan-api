import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanReportingFrequencyWorkspaceService } from './monitor-plan-reporting-freq.service';
import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { MonitorPlanReportingFrequencyWorkspaceController } from './monitor-plan-reporting-freq.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

jest.mock('./monitor-plan-reporting-freq.service');

const unitId = 1;

const data: ReportingFreqDTO[] = [];
data.push(new ReportingFreqDTO());
data.push(new ReportingFreqDTO());

describe('MonitorPlanReportingFrequencyWorkspaceController', () => {
  let controller: MonitorPlanReportingFrequencyWorkspaceController;
  let service: MonitorPlanReportingFrequencyWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorPlanReportingFrequencyWorkspaceController],
      providers: [
        MonitorPlanReportingFrequencyWorkspaceService,
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(MonitorPlanReportingFrequencyWorkspaceController);
    service = module.get(MonitorPlanReportingFrequencyWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReportingFreqs', () => {
    it('should return array of workspace reporting frequencies', async () => {
      jest.spyOn(service, 'getReportingFreqs').mockResolvedValue(data);
      expect(await controller.getReportingFreqs(unitId)).toBe(data);
    });
  });
});
