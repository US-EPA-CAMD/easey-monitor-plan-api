import { Test, TestingModule } from '@nestjs/testing';
import { CountyCodeController } from './county-code.controller';
import { CountyCodeService } from './county-code.service';

describe('CountyCodeController', () => {
  let controller: CountyCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountyCodeController],
      providers: [CountyCodeService],
    }).compile();

    controller = module.get<CountyCodeController>(CountyCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
