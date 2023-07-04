import { Test, TestingModule } from '@nestjs/testing';
import { CpmsQualificationWorkspaceService } from './cpms-qualification-workspace.service';

describe('CpmsQualificationWorkspaceService', () => {
  let service: CpmsQualificationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CpmsQualificationWorkspaceService],
    }).compile();

    service = module.get<CpmsQualificationWorkspaceService>(
      CpmsQualificationWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
