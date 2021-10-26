import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorLocationWorkspaceController } from './monitor-location.controller';

describe('MonitorLocationWorkspaceController', () => {
  let controller: MonitorLocationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorLocationWorkspaceController],
      providers: [ConfigService],
    }).compile();

    controller = module.get<MonitorLocationWorkspaceController>(
      MonitorLocationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
