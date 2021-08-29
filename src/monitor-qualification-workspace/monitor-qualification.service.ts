import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';

@Injectable()
export class MonitorQualificationWorkspaceService {
  constructor(
    @InjectRepository(MonitorQualificationWorkspaceRepository)
    private repository: MonitorQualificationWorkspaceRepository,
    private map: MonitorQualificationMap,
  ) {}

  async getQualifications(
    locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
