import { Test, TestingModule } from '@nestjs/testing';

import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorQualificationWorkspaceService', () => {
  let service: MonitorQualificationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorQualificationWorkspaceService,
        {
          provide: MonitorQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorQualificationWorkspaceService>(
      MonitorQualificationWorkspaceService,
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
