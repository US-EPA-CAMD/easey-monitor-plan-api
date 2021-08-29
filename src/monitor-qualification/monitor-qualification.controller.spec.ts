import { Test, TestingModule } from '@nestjs/testing';

import { MonitorQualificationController } from './monitor-qualification.controller';
import { MonitorQualificationService } from './monitor-qualification.service';

jest.mock('./monitor-qualification.service');

describe('MonitorQualificationController', () => {
  let controller: MonitorQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorQualificationController],
      providers: [MonitorQualificationService],
    }).compile();

    controller = module.get<MonitorQualificationController>(
      MonitorQualificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
