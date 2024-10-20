import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';

import { MonitorLocationWorkspaceController } from './monitor-location.controller';
import { MonitorLocationWorkspaceService } from './monitor-location.service';

describe('MonitorLocationWorkspaceController', () => {
  let controller: MonitorLocationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorLocationWorkspaceController],
      providers: [
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: MonitorLocationWorkspaceService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<MonitorLocationWorkspaceController>(
      MonitorLocationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
