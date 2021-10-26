import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorAttributeWorkspaceController } from './monitor-attribute.controller';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';

jest.mock('./monitor-attribute.service');

describe('MonitorAttributeWorkspaceController', () => {
  let controller: MonitorAttributeWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorAttributeWorkspaceController],
      providers: [MonitorAttributeWorkspaceService, ConfigService],
    }).compile();

    controller = module.get<MonitorAttributeWorkspaceController>(
      MonitorAttributeWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
