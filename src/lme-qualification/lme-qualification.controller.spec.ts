import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LMEQualificationController } from './lme-qualification.controller';
import { LMEQualificationService } from './lme-qualification.service';

jest.mock('./lme-qualification.service');

describe('LMEQualificationController', () => {
  let controller: LMEQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [LMEQualificationController],
      providers: [LMEQualificationService],
    }).compile();

    controller = module.get<LMEQualificationController>(
      LMEQualificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
