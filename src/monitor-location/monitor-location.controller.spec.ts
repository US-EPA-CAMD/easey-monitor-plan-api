import { Test, TestingModule } from '@nestjs/testing';
import { MonitorLocationController } from './monitor-location.controller';

describe('MonitorLocationController', () => {
  let controller: MonitorLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorLocationController],
    }).compile();

    controller = module.get<MonitorLocationController>(MonitorLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
