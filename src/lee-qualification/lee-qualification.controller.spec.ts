import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LEEQualificationController } from './lee-qualification.controller';
import { LEEQualificationService } from './lee-qualification.service';

jest.mock('./lee-qualification.service');

describe('LEEQualificationController', () => {
  let controller: LEEQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [LEEQualificationController],
      providers: [LEEQualificationService],
    }).compile();

    controller = module.get<LEEQualificationController>(
      LEEQualificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
