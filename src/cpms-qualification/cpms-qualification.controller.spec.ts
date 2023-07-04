import { Test, TestingModule } from '@nestjs/testing';
import { CPMSQualificationController } from './cpms-qualification.controller';
import { CPMSQualificationService } from './cpms-qualification.service';
import { CPMSQualificationRepository } from './cpms-qualification.repository';

describe('CPMSQualificationController', () => {
  let controller: CPMSQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CPMSQualificationController],
      providers: [CPMSQualificationService, CPMSQualificationRepository],
    }).compile();

    controller = module.get<CPMSQualificationController>(
      CPMSQualificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
