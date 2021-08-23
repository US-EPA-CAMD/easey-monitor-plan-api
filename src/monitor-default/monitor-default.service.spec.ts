import { Test, TestingModule } from '@nestjs/testing';
import { MonitorDefaultService } from './monitor-default.service';

describe('MonitorDefaultService', () => {
  let service: MonitorDefaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorDefaultService],
    }).compile();

    service = module.get<MonitorDefaultService>(MonitorDefaultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
