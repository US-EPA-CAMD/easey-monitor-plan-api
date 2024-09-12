import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ReportingFreqWorkspaceService } from './reporting-freq.service';
import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { ReportingFreqWorkspaceController } from './reporting-freq.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

jest.mock('./reporting-freq.service');

const locId = 'some location id';
const unitId = 1;

const data: ReportingFreqDTO[] = [];
data.push(new ReportingFreqDTO());
data.push(new ReportingFreqDTO());

describe('ReportingFreqWorkspaceController', () => {
  let controller: ReportingFreqWorkspaceController;
  let service: ReportingFreqWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [ReportingFreqWorkspaceController],
      providers: [
        ReportingFreqWorkspaceService,
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(ReportingFreqWorkspaceController);
    service = module.get(ReportingFreqWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReportingFreqs', () => {
    it('should return array of workspace reporting frequencies', async () => {
      jest.spyOn(service, 'getReportingFreqs').mockResolvedValue(data);
      expect(await controller.getReportingFreqs(locId, unitId)).toBe(data);
    });
  });
});
