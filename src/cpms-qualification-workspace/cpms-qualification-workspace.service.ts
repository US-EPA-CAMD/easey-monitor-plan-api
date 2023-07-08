import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';

@Injectable()
export class CPMSQualificationWorkspaceService {
  constructor(
    @InjectRepository(CPMSQualificationWorkspaceRepository)
    private readonly repository: CPMSQualificationWorkspaceRepository,
  ) {}
}
