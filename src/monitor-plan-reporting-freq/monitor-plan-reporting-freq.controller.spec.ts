import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanReportingFrequencyService } from './monitor-plan-reporting-freq.service';
import { MonitorPlanReportingFrequencyController } from './monitor-plan-reporting-freq.controller';
import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';

jest.mock('./monitor-plan-reporting-freq.service');

const unitId = 1;

const data: ReportingFreqDTO[] = [];
data.push(new ReportingFreqDTO());
data.push(new ReportingFreqDTO());

describe('MonitorPlanReportingFrequencyController', () => {
  let controller: MonitorPlanReportingFrequencyController;
  let service: MonitorPlanReportingFrequencyService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorPlanReportingFrequencyController],
      providers: [MonitorPlanReportingFrequencyService],
    }).compile();

    controller = module.get(MonitorPlanReportingFrequencyController);
    service = module.get(MonitorPlanReportingFrequencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReportingFreqs', () => {
    it('should return array of reporting frequencies', async () => {
      jest.spyOn(service, 'getReportingFreqs').mockResolvedValue(data);
      expect(await controller.getReportingFreqs(unitId)).toBe(data);
    });
  });
});
