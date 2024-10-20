import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';

import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';
import { CheckOutController } from './check-out.controller';

describe('CheckOutController', () => {
  let controller: CheckOutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [CheckOutController],
      providers: [
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: UserCheckOutService,
          useFactory: () => ({}),
        },
        {
          provide: MonitorPlanWorkspaceService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<CheckOutController>(CheckOutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
