import { Test, TestingModule } from '@nestjs/testing';
import { CountyCodeController } from './county-code.controller';
import { CountyCodeService } from './county-code.service';

const mockCountyCodeService = () => ({
  getCountyCode: jest.fn().mockResolvedValue(''),
});

describe('CountyCodeController', () => {
  let controller: CountyCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountyCodeController],
      providers: [
        {
          provide: CountyCodeService,
          useFactory: mockCountyCodeService,
        },
      ],
    }).compile();

    controller = module.get<CountyCodeController>(CountyCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
