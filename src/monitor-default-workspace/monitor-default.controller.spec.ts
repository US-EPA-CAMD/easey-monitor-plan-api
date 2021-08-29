import { Test, TestingModule } from '@nestjs/testing';

import { MonitorDefaultWorkspaceController } from './monitor-default.controller';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';

jest.mock('./monitor-default.service');

describe('MonitorDefaultWorkspaceController', () => {
  let controller: MonitorDefaultWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorDefaultWorkspaceController],
      providers: [MonitorDefaultWorkspaceService],
    }).compile();

    controller = module.get<MonitorDefaultWorkspaceController>(
      MonitorDefaultWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
