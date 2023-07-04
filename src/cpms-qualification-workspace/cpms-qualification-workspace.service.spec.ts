import { Test, TestingModule } from '@nestjs/testing';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';

describe('CPMSQualificationWorkspaceService', () => {
  let service: CPMSQualificationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CPMSQualificationWorkspaceService,
        CPMSQualificationWorkspaceRepository,
      ],
    }).compile();

    service = module.get<CPMSQualificationWorkspaceService>(
      CPMSQualificationWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
