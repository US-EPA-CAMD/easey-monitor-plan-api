import { Injectable } from '@nestjs/common';

import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { LEEQualificationRepository } from './lee-qualification.repository';

@Injectable()
export class LEEQualificationService {
  constructor(
    private readonly repository: LEEQualificationRepository,
    private readonly map: LEEQualificationMap,
  ) {}

  async getLEEQualifications(
    qualificationId: string,
  ): Promise<LEEQualificationDTO[]> {
    const results = await this.repository.findBy({ qualificationId });
    return this.map.many(results);
  }
}
