import { Injectable } from '@nestjs/common';

import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorQualificationRepository } from './monitor-qualification.repository';

@Injectable()
export class MonitorQualificationService {
  constructor(
    private repository: MonitorQualificationRepository,
    private map: MonitorQualificationMap,
  ) {}

  async getQualifications(
    locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }
}
