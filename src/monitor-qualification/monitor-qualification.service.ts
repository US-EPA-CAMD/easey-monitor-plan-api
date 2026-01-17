import { Injectable } from '@nestjs/common';

import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorQualificationRepository } from './monitor-qualification.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorQualificationService {
  constructor(
    private map: MonitorQualificationMap,
    private readonly dataSource: DataSource,
  ) {}

  async getQualifications(
    locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorQualificationRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
