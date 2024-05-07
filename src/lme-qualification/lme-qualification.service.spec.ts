import { Test, TestingModule } from '@nestjs/testing';

import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { LMEQualificationService } from './lme-qualification.service';
import { LMEQualificationRepository } from './lme-qualification.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('LMEQualificationService', () => {
  let service: LMEQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LMEQualificationService,
        {
          provide: LMEQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: LMEQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<LMEQualificationService>(LMEQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLMEQualifications', () => {
    it('should return array of lme qualifications', async () => {
      const result = await service.getLMEQualifications(null);
      expect(result).toEqual('');
    });
  });
});
