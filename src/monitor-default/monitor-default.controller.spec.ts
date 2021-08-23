import { Test, TestingModule } from '@nestjs/testing';
import { MonitorDefaultController } from './monitor-default.controller';
import { MonitorDefaultService } from './monitor-default.service';

describe('MonitorDefaultController', () => {
  let controller: MonitorDefaultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorDefaultController],
      providers: [MonitorDefaultService],
    }).compile();

    controller = module.get<MonitorDefaultController>(MonitorDefaultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
