import { Test, TestingModule } from '@nestjs/testing';

import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('LMEQualificationWorkspaceService', () => {
  let service: LMEQualificationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LMEQualificationWorkspaceService,
        {
          provide: LMEQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: LMEQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<LMEQualificationWorkspaceService>(
      LMEQualificationWorkspaceService,
    );
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
