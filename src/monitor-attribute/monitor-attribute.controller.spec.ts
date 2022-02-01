import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorAttributeController } from './monitor-attribute.controller';
import { MonitorAttributeService } from './monitor-attribute.service';

jest.mock('./monitor-attribute.service');

describe('MonitorAttributeController', () => {
  let controller: MonitorAttributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorAttributeController],
      providers: [MonitorAttributeService],
    }).compile();

    controller = module.get<MonitorAttributeController>(
      MonitorAttributeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
