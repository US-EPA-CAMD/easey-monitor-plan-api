import { Injectable } from '@nestjs/common';

import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { CPMSQualificationRepository } from './cpms-qualification.repository';

@Injectable()
export class CPMSQualificationService {
  constructor(
    private readonly repository: CPMSQualificationRepository,
    private readonly map: CPMSQualificationMap,
  ) {}

  async getCPMSQualifications(
    locId: string,
    qualId: string,
  ): Promise<CPMSQualificationDTO[]> {
    const results = await this.repository.getCPMSQualifications(locId, qualId);
    return this.map.many(results);
  }
}
