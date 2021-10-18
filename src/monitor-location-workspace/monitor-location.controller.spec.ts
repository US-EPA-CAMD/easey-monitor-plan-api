import { Test, TestingModule } from '@nestjs/testing';
import { MonitorLocationWorkspaceController } from './monitor-location.controller';

describe('MonitorLocationWorkspaceController', () => {
  let controller: MonitorLocationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorLocationWorkspaceController],
    }).compile();

    controller = module.get<MonitorLocationWorkspaceController>(
      MonitorLocationWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
