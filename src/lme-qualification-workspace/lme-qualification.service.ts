import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationMap } from '../maps/lme-qualification.map';

@Injectable()
export class LMEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LMEQualificationWorkspaceRepository)
    private repository: LMEQualificationWorkspaceRepository,
    private map: LMEQualificationMap,
  ) {}

  async getLMEQualifications(
    qualificationId: string,
  ): Promise<LMEQualificationDTO[]> {
    const results = await this.repository.find({ qualificationId });
    return this.map.many(results);
  }
}
