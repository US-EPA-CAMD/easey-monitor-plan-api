import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorQualificationService } from './monitor-qualification.service';
import { MonitorQualificationRepository } from './monitor-qualification.repository';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorQualificationService', () => {
  let service: MonitorQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorQualificationService,
        {
          provide: MonitorQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorQualificationService>(
      MonitorQualificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQualifications', () => {
    it('should return array of location qualifications', async () => {
      const result = await service.getQualifications(null);
      expect(result).toEqual('');
    });
  });
});
