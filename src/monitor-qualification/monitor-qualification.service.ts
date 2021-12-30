import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorQualificationRepository } from './monitor-qualification.repository';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class MonitorQualificationService {
  constructor(
    @InjectRepository(MonitorQualificationRepository)
    private repository: MonitorQualificationRepository,
    private map: MonitorQualificationMap,
    private readonly logger: Logger,
  ) {}

  async getQualifications(
    locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
