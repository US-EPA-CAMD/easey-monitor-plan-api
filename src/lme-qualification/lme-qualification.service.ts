import { Injectable } from '@nestjs/common';

import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { LMEQualificationRepository } from './lme-qualification.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class LMEQualificationService {
  constructor(
    private map: LMEQualificationMap,
    private readonly dataSource: DataSource,
  ) {}

  async getLMEQualifications(
    qualificationId: string,
  ): Promise<LMEQualificationDTO[]> {
    const results = await useSlaveRepository(this.dataSource, LMEQualificationRepository, async (repository) => repository.findBy({ qualificationId }));
    return this.map.many(results);
  }
}
