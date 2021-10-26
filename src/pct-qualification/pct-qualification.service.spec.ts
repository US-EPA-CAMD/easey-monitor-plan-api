import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { PCTQualificationService } from './pct-qualification.service';
import { PCTQualificationRepository } from './pct-qualification.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('PCTQualificationService', () => {
  let service: PCTQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        PCTQualificationService,
        {
          provide: PCTQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: PCTQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<PCTQualificationService>(PCTQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPCTQualifications', () => {
    it('should return array of pct qualifications', async () => {
      const result = await service.getPCTQualifications(null);
      expect(result).toEqual('');
    });
  });
});
