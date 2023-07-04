import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';
import { CPMSQualification } from 'src/entities/workspace/cpms-qualification.entity';

@Injectable()
export class CPMSQualificationWorkspaceService {
  constructor(
    @InjectRepository(CPMSQualificationWorkspaceRepository)
    private readonly repository: CPMSQualificationWorkspaceRepository,
  ) {}
}
