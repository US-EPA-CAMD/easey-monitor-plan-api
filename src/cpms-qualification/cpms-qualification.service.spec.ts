import { Test, TestingModule } from '@nestjs/testing';
import { CPMSQualificationService } from './cpms-qualification.service';
import { CPMSQualificationRepository } from './cpms-qualification.repository';

describe('CPMSQualificationService', () => {
  let service: CPMSQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CPMSQualificationService, CPMSQualificationRepository],
    }).compile();

    service = module.get<CPMSQualificationService>(CPMSQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
