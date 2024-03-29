import { Test, TestingModule } from '@nestjs/testing';
import { MonitorPlanLocationWorkspaceRepository } from './monitor-plan-location.repository';
import { MonitorPlanLocationService } from './monitor-plan-location.service';

describe('MonitorPlanLocationService', () => {
  let service: MonitorPlanLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorPlanLocationService,
        MonitorPlanLocationWorkspaceRepository,
      ],
    }).compile();

    service = module.get<MonitorPlanLocationService>(
      MonitorPlanLocationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
