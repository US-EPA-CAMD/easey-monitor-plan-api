import { Injectable } from '@nestjs/common';

import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { PCTQualificationRepository } from './pct-qualification.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class PCTQualificationService {
  constructor(
    private map: PCTQualificationMap,
    private readonly dataSource: DataSource,
  ) {}

  async getPCTQualifications(
    qualificationId: string,
  ): Promise<PCTQualificationDTO[]> {
    const results = await useSlaveRepository(this.dataSource, PCTQualificationRepository, async (repository) => repository.findBy({ qualificationId }));
    return this.map.many(results);
  }
}
