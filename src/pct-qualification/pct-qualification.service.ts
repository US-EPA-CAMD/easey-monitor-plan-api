import { Injectable } from '@nestjs/common';

import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { PCTQualificationRepository } from './pct-qualification.repository';

@Injectable()
export class PCTQualificationService {
  constructor(
    private repository: PCTQualificationRepository,
    private map: PCTQualificationMap,
  ) {}

  async getPCTQualifications(
    qualificationId: string,
  ): Promise<PCTQualificationDTO[]> {
    const results = await this.repository.findBy({ qualificationId });
    return this.map.many(results);
  }
}
