import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';

import { MonitorDefaultWorkspaceController } from './monitor-default.controller';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';

jest.mock('./monitor-default.service');

describe('MonitorDefaultWorkspaceController', () => {
  let controller: MonitorDefaultWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorDefaultWorkspaceController],
      providers: [
        MonitorDefaultWorkspaceService,
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MonitorDefaultWorkspaceController>(
      MonitorDefaultWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
