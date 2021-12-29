import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LEEQualificationRepository } from './lee-qualification.repository';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class LEEQualificationService {
  constructor(
    @InjectRepository(LEEQualificationRepository)
    private repository: LEEQualificationRepository,
    private map: LEEQualificationMap,
    private readonly logger: Logger,
  ) {}

  async getLEEQualifications(
    qualificationId: string,
  ): Promise<LEEQualificationDTO[]> {
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
