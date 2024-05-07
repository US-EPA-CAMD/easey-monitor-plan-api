import { Injectable } from '@nestjs/common';

import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { LMEQualificationRepository } from './lme-qualification.repository';

@Injectable()
export class LMEQualificationService {
  constructor(
    private repository: LMEQualificationRepository,
    private map: LMEQualificationMap,
  ) {}

  async getLMEQualifications(
    qualificationId: string,
  ): Promise<LMEQualificationDTO[]> {
    const results = await this.repository.findBy({ qualificationId });
    return this.map.many(results);
  }
}
