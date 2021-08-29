import { Test, TestingModule } from '@nestjs/testing';

import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('PCTQualificationWorkspaceService', () => {
  let service: PCTQualificationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PCTQualificationWorkspaceService,
        {
          provide: PCTQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: PCTQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<PCTQualificationWorkspaceService>(
      PCTQualificationWorkspaceService,
    );
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
