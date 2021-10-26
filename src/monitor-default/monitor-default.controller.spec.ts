import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorDefaultController } from './monitor-default.controller';
import { MonitorDefaultService } from './monitor-default.service';

jest.mock('./monitor-default.service');

describe('MonitorDefaultController', () => {
  let controller: MonitorDefaultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorDefaultController],
      providers: [MonitorDefaultService],
    }).compile();

    controller = module.get<MonitorDefaultController>(MonitorDefaultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
