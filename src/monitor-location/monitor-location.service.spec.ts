import { Test, TestingModule } from '@nestjs/testing';
import { MonitorLocationService } from './monitor-location.service';

describe('MonitorLocationService', () => {
  let service: MonitorLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorLocationService],
    }).compile();

    service = module.get<MonitorLocationService>(MonitorLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
