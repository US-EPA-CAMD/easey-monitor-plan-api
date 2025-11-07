import { Injectable } from '@nestjs/common';

import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { LEEQualificationRepository } from './lee-qualification.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class LEEQualificationService {
  constructor(
    private readonly map: LEEQualificationMap,
    private readonly dataSource: DataSource,
  ) {}

  async getLEEQualifications(
    qualificationId: string,
  ): Promise<LEEQualificationDTO[]> {
    const results = await useSlaveRepository(this.dataSource, LEEQualificationRepository, async (repository) => repository.findBy({ qualificationId }));
    return this.map.many(results);
  }
}
