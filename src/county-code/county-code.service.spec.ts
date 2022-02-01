import { Test, TestingModule } from '@nestjs/testing';
import { CountyCodeMap } from '../maps/county-code.map';
import { CountyCodeRepository } from './county-code.repository';
import { CountyCodeService } from './county-code.service';

const countyCode = '';

const mockCountyCodeMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

const mockCountyCodeRepository = () => ({
  findOne: jest.fn().mockResolvedValue(''),
});

describe('CountyCodeService', () => {
  let service: CountyCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountyCodeService,
        {
          provide: CountyCodeRepository,
          useFactory: mockCountyCodeRepository,
        },
        {
          provide: CountyCodeMap,
          useFactory: mockCountyCodeMap,
        },
      ],
    }).compile();

    service = module.get<CountyCodeService>(CountyCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCountyCode', () => {
    it('should return a county code', async () => {
      const result = await service.getCountyCode('');
      expect(result).toEqual('');
    });
  });
});
