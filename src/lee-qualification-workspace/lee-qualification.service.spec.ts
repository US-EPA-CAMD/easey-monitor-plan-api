import { Test, TestingModule } from '@nestjs/testing';

import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('LEEQualificationWorkspaceService', () => {
  let service: LEEQualificationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LEEQualificationWorkspaceService,
        {
          provide: LEEQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: LEEQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<LEEQualificationWorkspaceService>(
      LEEQualificationWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLEEQualifications', () => {
    it('should return array of lee qualifications', async () => {
      const result = await service.getLEEQualifications(null);
      expect(result).toEqual('');
    });
  });
});
