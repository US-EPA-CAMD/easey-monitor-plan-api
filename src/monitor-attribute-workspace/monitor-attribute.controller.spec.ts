import { Test, TestingModule } from '@nestjs/testing';

import { MonitorAttributeWorkspaceController } from './monitor-attribute.controller';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';

jest.mock('./monitor-attribute.service');

describe('MonitorAttributeWorkspaceController', () => {
  let controller: MonitorAttributeWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorAttributeWorkspaceController],
      providers: [MonitorAttributeWorkspaceService],
    }).compile();

    controller = module.get<MonitorAttributeWorkspaceController>(
      MonitorAttributeWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
