import { Test, TestingModule } from '@nestjs/testing';

import { LEEQualificationController } from './lee-qualification.controller';
import { LEEQualificationService } from './lee-qualification.service';

jest.mock('./lee-qualification.service');

describe('LEEQualificationController', () => {
  let controller: LEEQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
