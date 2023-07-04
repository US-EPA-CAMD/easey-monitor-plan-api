import { Test, TestingModule } from '@nestjs/testing';
import { CpmsQualificationService } from './cpms-qualification.service';

describe('CpmsQualificationService', () => {
  let service: CpmsQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CpmsQualificationService],
    }).compile();

    service = module.get<CpmsQualificationService>(CpmsQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
