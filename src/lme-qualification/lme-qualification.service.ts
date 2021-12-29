import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LMEQualificationRepository } from './lme-qualification.repository';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class LMEQualificationService {
  constructor(
    @InjectRepository(LMEQualificationRepository)
    private repository: LMEQualificationRepository,
    private map: LMEQualificationMap,
    private readonly logger: Logger,
  ) {}

  async getLMEQualifications(
    qualificationId: string,
  ): Promise<LMEQualificationDTO[]> {
    this.logger.info('Getting duct wafs');

    let result;
    try {
      result = await this.repository.find({ qualificationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got duct wafs');

    return this.map.many(result);
  }
}
