import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ReportingFreqService } from './reporting-freq.service';
import { ReportingFreqController } from './reporting-freq.controller';
import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';

jest.mock('./reporting-freq.service');

const locId = 'some location id';
const unitId = 1;

const data: ReportingFreqDTO[] = [];
data.push(new ReportingFreqDTO());
data.push(new ReportingFreqDTO());

describe('ReportingFreqController', () => {
  let controller: ReportingFreqController;
  let service: ReportingFreqService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [ReportingFreqController],
      providers: [ReportingFreqService],
    }).compile();

    controller = module.get(ReportingFreqController);
    service = module.get(ReportingFreqService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReportingFreqs', () => {
    it('should return array of reporting frequencies', async () => {
      jest.spyOn(service, 'getReportingFreqs').mockResolvedValue(data);
      expect(await controller.getReportingFreqs(locId, unitId)).toBe(data);
    });
  });
});
