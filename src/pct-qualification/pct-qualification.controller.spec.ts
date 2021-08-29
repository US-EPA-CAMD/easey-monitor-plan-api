import { Test, TestingModule } from '@nestjs/testing';

import { PCTQualificationController } from './pct-qualification.controller';
import { PCTQualificationService } from './pct-qualification.service';

jest.mock('./pct-qualification.service');

describe('PCTQualificationController', () => {
  let controller: PCTQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PCTQualificationController],
      providers: [PCTQualificationService],
    }).compile();

    controller = module.get<PCTQualificationController>(
      PCTQualificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
