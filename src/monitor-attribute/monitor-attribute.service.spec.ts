import { Test, TestingModule } from '@nestjs/testing';
import { MonitorAttributeService } from './monitor-attribute.service';

describe('MonitorAttributeService', () => {
  let service: MonitorAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorAttributeService],
    }).compile();

    service = module.get<MonitorAttributeService>(MonitorAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
