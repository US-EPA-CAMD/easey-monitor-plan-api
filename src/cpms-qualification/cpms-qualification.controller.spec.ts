import { Test, TestingModule } from '@nestjs/testing';
import { CpmsQualificationController } from './cpms-qualification.controller';
import { CpmsQualificationService } from './cpms-qualification.service';

describe('CpmsQualificationController', () => {
  let controller: CpmsQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CpmsQualificationController],
      providers: [CpmsQualificationService],
    }).compile();

    controller = module.get<CpmsQualificationController>(
      CpmsQualificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
