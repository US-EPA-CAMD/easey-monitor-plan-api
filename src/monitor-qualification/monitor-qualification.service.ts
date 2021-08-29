import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorQualificationRepository } from './monitor-qualification.repository';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';

@Injectable()
export class MonitorQualificationService {
  constructor(
    @InjectRepository(MonitorQualificationRepository)
    private repository: MonitorQualificationRepository,
    private map: MonitorQualificationMap,
  ) {}

  async getQualifications(
    locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
