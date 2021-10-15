import { Test, TestingModule } from '@nestjs/testing';
import { MonitorLocationWorkspaceService } from './monitor-location.service';

describe('MonitorLocationWorkspaceService', () => {
  let service: MonitorLocationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorLocationWorkspaceService],
    }).compile();

    service = module.get<MonitorLocationWorkspaceService>(
      MonitorLocationWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
