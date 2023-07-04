import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CPMSQualification } from 'src/entities/workspace/cpms-qualification.entity';

@Injectable()
export class CPMSQualificationWorkspaceService {
  constructor(
    @InjectRepository(CPMSQualificationWorkspaceRepository)
    private readonly repository: CPMSQualificationWorkspaceRepository,
    private readonly map: CPMSQualificationMap,
    private readonly logger: Logger,
  ) {}

  async getCPMSQualifications(
    locId: string,
    qualId: string,
  ): Promise<CPMSQualification[]> {
    const results = await this.repository.getCPMSQualifications(locId, qualId);
    return results;
  }
}
