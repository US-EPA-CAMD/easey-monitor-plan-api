import { Test, TestingModule } from '@nestjs/testing';
import { CountyCodeService } from './county-code.service';

describe('CountyCodeService', () => {
  let service: CountyCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountyCodeService],
    }).compile();

    service = module.get<CountyCodeService>(CountyCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
