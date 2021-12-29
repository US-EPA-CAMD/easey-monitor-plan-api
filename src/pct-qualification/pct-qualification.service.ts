import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PCTQualificationRepository } from './pct-qualification.repository';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class PCTQualificationService {
  constructor(
    @InjectRepository(PCTQualificationRepository)
    private repository: PCTQualificationRepository,
    private map: PCTQualificationMap,
    private readonly logger: Logger,
  ) {}

  async getPCTQualifications(
    qualificationId: string,
  ): Promise<PCTQualificationDTO[]> {
    let result;
    try {
      result = await this.repository.find({ qualificationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
